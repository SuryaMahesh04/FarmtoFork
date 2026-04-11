const Shipment = require('../models/Shipment');
const Batch = require('../models/Batch');
const User = require('../models/User');
const Driver = require('../models/Driver');
const Notification = require('../models/Notification');
const { decrypt } = require('../utils/cryptoEngine');

/**
 * Helper to decrypt batch specific fields for API response
 */
const decryptBatchData = (batch) => {
    if (!batch) return null;
    try {
        const decryptedBatch = batch.toObject ? batch.toObject() : { ...batch };
        
        if (decryptedBatch.quantity && typeof decryptedBatch.quantity === 'object') {
            decryptedBatch.quantity = decrypt(decryptedBatch.quantity);
        }
        if (decryptedBatch.pricePerUnit && typeof decryptedBatch.pricePerUnit === 'object') {
            decryptedBatch.pricePerUnit = decrypt(decryptedBatch.pricePerUnit);
        }
        if (decryptedBatch.location?.gpsCoordinates && typeof decryptedBatch.location.gpsCoordinates === 'object') {
            decryptedBatch.location.gpsCoordinates = decrypt(decryptedBatch.location.gpsCoordinates);
        }
        if (decryptedBatch.notes && typeof decryptedBatch.notes === 'object') {
            decryptedBatch.notes = decrypt(decryptedBatch.notes);
        }
        
        return decryptedBatch;
    } catch (err) {
        console.error('Decryption error on batch:', err);
        return batch;
    }
};

exports.createShipment = async (req, res) => {
    try {
        const { batchId, distributorId, transporterId, coordinates, date } = req.body;
        const farmerId = req.user.id;

        // Verify batch ownership
        const batch = await Batch.findOne({ _id: batchId, farmerId });
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Batch not found or unauthorized'
            });
        }

        // Generate Shipment ID
        const count = await Shipment.countDocuments();
        const shipmentId = `SHP${String(count + 1).padStart(4, '0')}`;

        const shipment = await Shipment.create({
            shipmentId,
            farmer: farmerId,
            batch: batchId,
            distributor: distributorId,
            transporter: transporterId,
            coordinates: coordinates, // Assuming input
            date: date || new Date(),
            trackingUpdates: [{
                status: 'pending',
                location: 'Origin',
                notes: 'Shipment created'
            }]
        });

        // Create Notifications for Distributor and Transporter
        await Notification.create([
            {
                recipient: distributorId,
                sender: farmerId,
                type: 'shipment_request',
                message: `New shipment request ${shipmentId} from farmer`,
                relatedId: shipment._id,
                relatedModel: 'Shipment'
            },
            {
                recipient: transporterId,
                sender: farmerId,
                type: 'shipment_request',
                message: `New shipment request ${shipmentId} from farmer`,
                relatedId: shipment._id,
                relatedModel: 'Shipment'
            }
        ]);

        res.status(201).json({
            success: true,
            data: shipment
        });
    } catch (error) {
        console.error('Create shipment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create shipment',
            error: error.message
        });
    }
};

exports.getShipments = async (req, res) => {
    try {
        const query = {};

        // Filter based on role
        if (req.user.role === 'farmer') {
            query.farmer = req.user.id;
        } else if (req.user.role === 'transporter') {
            query.transporter = req.user.id;
        } else if (req.user.role === 'distributor') {
            query.distributor = req.user.id;
        } else if (req.user.role === 'driver') {
            query.driver = req.user.id; // Correctly filter for driver
        }

        const shipments = await Shipment.find(query)
            .populate('farmer', 'profile.fullName profile.address profile.village profile.district profile.city profile.state')
            .populate('batch')
            .populate('distributor', 'profile.companyName profile.fullName profile.address profile.city profile.state')
            .populate('transporter', 'profile.companyName profile.fullName profile.address profile.city profile.state')
            .populate('driver', 'profile.fullName profile.mobile')
            .sort({ createdAt: -1 });

        const decryptedShipments = shipments.map(shipment => {
            const shpObj = shipment.toObject();
            if (shpObj.batch) {
                shpObj.batch = decryptBatchData(shpObj.batch);
            }
            return shpObj;
        });

        res.json({
            success: true,
            data: decryptedShipments
        });
    } catch (error) {
        console.error('Get shipments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch shipments'
        });
    }
};

exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id)
            .populate('farmer', 'profile.fullName profile.mobile profile.address profile.village profile.district profile.city profile.state')
            .populate('batch')
            .populate('distributor', 'profile.companyName profile.fullName profile.address profile.city profile.state profile.district')
            .populate('transporter', 'profile.companyName profile.fullName profile.address profile.city profile.state')
            .populate('driver', 'profile.fullName profile.mobile');

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        const shpObj = shipment.toObject();
        if (shpObj.batch) {
            shpObj.batch = decryptBatchData(shpObj.batch);
        }

        res.json({
            success: true,
            data: shpObj
        });
    } catch (error) {
        console.error('Get shipment details error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.assignDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverId } = req.body;
        const transporterId = req.user.id;

        const shipment = await Shipment.findById(id);

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        // Verify transporter owns this shipment
        if (shipment.transporter.toString() !== transporterId) {
            return res.status(403).json({ success: false, message: 'Not authorized to modify this shipment' });
        }

        // Find driver by ID and verify ownership
        const driverDoc = await Driver.findOne({ _id: driverId, transporter: transporterId });

        if (!driverDoc) {
            console.log(`Driver not found for ID: ${driverId} and Transporter: ${transporterId}`);
            return res.status(404).json({ success: false, message: 'Driver not found or unauthorized' });
        }

        shipment.driver = driverDoc.user; // Assign USER ID of the driver
        shipment.status = 'assigned';
        shipment.driverStatus = 'pending';

        shipment.trackingUpdates.push({
            status: 'assigned',
            location: 'System Update',
            notes: `Driver ${driverDoc.fullName} assigned by transporter`
        });

        await shipment.save();

        // Sync with Batch Journey
        await Batch.findByIdAndUpdate(shipment.batch, {
            $push: {
                journey: {
                    stage: 'assigned',
                    location: 'System Update',
                    actorId: transporterId,
                    actorRole: 'transporter',
                    details: `Driver ${driverDoc.fullName} assigned to shipment ${shipment.shipmentId}`,
                    timestamp: new Date()
                }
            }
        });

        // Notify Driver
        await Notification.create({
            recipient: driverDoc.user,
            sender: transporterId,
            type: 'shipment_assignment',
            message: `You have been assigned to shipment ${shipment.shipmentId}`,
            relatedId: shipment._id,
            relatedModel: 'Shipment'
        });

        res.json({
            success: true,
            data: shipment,
            message: 'Driver assigned successfully'
        });

    } catch (error) {
        console.error('Assign driver error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateShipmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        const shipment = await Shipment.findById(id)
            .populate('farmer', 'profile.fullName profile.mobile profile.address profile.village profile.district profile.city profile.state')
            .populate('batch')
            .populate('distributor', 'profile.companyName profile.fullName profile.address profile.city profile.state profile.district')
            .populate('transporter', 'profile.companyName profile.fullName profile.address profile.city profile.state')
            .populate('driver', 'profile.fullName');

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        // Authorization Check: Transporter, Distributor, or Driver
        const isTransporter = shipment.transporter._id.toString() === userId;
        const isDistributor = shipment.distributor._id.toString() === userId;
        const isDriver = shipment.driver && shipment.driver._id.toString() === userId;

        if (!isTransporter && !isDistributor && !isDriver) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Fetch current user details for notes
        const currentUser = await User.findById(userId);
        const actionerName = currentUser?.profile?.companyName || currentUser?.profile?.fullName || 'User';

        let updateLocation = 'System Update';
        let updateNotes = `Status updated to ${status} by ${actionerName}`;

        // Handle specific logic
        if (status === 'accepted') {
            if (isTransporter) shipment.transporterStatus = 'accepted';
            if (isDistributor) shipment.distributorStatus = 'accepted';
            if (isDriver) shipment.driverStatus = 'accepted';

            // Global acceptance check
            if (shipment.transporterStatus === 'accepted' && shipment.distributorStatus === 'accepted') {
                shipment.status = 'accepted';
                updateLocation = 'Virtual Handshake';
                updateNotes = 'Both parties accepted. Ready for pickup.';
            } else {
                // Partial acceptance
                updateNotes = `${actionerName} accepted the request.`;
            }
        } else if (status === 'rejected') {
            if (isTransporter) shipment.transporterStatus = 'rejected';
            if (isDistributor) shipment.distributorStatus = 'rejected';
            // Driver rejection? Maybe 'declined'
            shipment.status = 'rejected';
        } else {
            // Other statuses (picked_up, etc)
            shipment.status = status;

            // Location Logic
            const getFarmerLocation = () => {
                const addr = shipment.farmer?.profile?.address;
                return addr?.city || addr?.formattedAddress || 'Farm Location';
            };
            const getDistributorLocation = () => {
                const addr = shipment.distributor?.profile?.address;
                return addr?.city || addr?.formattedAddress || 'Distributor Warehouse';
            };

            if (status === 'at_pickup' || status === 'picked_up') {
                updateLocation = getFarmerLocation();
            } else if (status === 'in-transit') {
                updateLocation = 'En Route';
            } else if (status === 'delivered') {
                updateLocation = getDistributorLocation();
            }
        }

        // Add update to history
        shipment.trackingUpdates.push({
            status: status,
            location: updateLocation,
            notes: updateNotes
        });

        await shipment.save();

        // Notify Relevant Parties about Status Change
        try {
            const notifications = [];
            const shipmentId = shipment.shipmentId;

            // Farmer wants to know when accepted, picked up, or delivered
            if (['accepted', 'picked_up', 'delivered', 'rejected'].includes(status)) {
                notifications.push({
                    recipient: shipment.farmer._id || shipment.farmer,
                    message: `Shipment ${shipmentId} is now ${status.replace('_', ' ')}`
                });
            }

            // Distributor wants to know when picked up, in-transit, or delivered
            if (['picked_up', 'in-transit', 'delivered'].includes(status)) {
                notifications.push({
                    recipient: shipment.distributor._id || shipment.distributor,
                    message: `Incoming shipment ${shipmentId} is now ${status.replace('_', ' ')}`
                });
            }

            // Transporter wants to know if distributor completed/delivered
            if (['delivered', 'completed'].includes(status) && isDistributor) {
                notifications.push({
                    recipient: shipment.transporter._id || shipment.transporter,
                    message: `Shipment ${shipmentId} has been received by distributor`
                });
            }

            for (const n of notifications) {
                // Don't notify the person who performed the action
                if (n.recipient.toString() !== userId) {
                    await Notification.create({
                        recipient: n.recipient,
                        sender: userId,
                        type: 'shipment_update',
                        message: n.message,
                        relatedId: shipment._id,
                        relatedModel: 'Shipment'
                    });
                }
            }
        } catch (nErr) {
            console.error('Shipment status notification error:', nErr);
        }

        // Sync with Batch Journey
        try {
            await Batch.findByIdAndUpdate(shipment.batch._id || shipment.batch, {
                $push: {
                    journey: {
                        stage: status,
                        location: updateLocation,
                        actorId: userId,
                        actorRole: req.user.role || 'system',
                        details: updateNotes,
                        timestamp: new Date()
                    }
                }
            });
        } catch (bErr) {
            console.error('Failed to update batch journey:', bErr);
        }

        // Update Vehicle Status if driver is assigned
        if (shipment.driver) {
            try {
                const Vehicle = require('../models/Vehicle');
                const Driver = require('../models/Driver');

                // Find driver profile
                const driverDoc = await Driver.findOne({ user: shipment.driver });

                if (driverDoc && driverDoc.assignedVehicle) {
                    let newVehicleStatus = null;

                    // Map shipment status to vehicle status
                    if (['at_pickup', 'picked_up', 'in-transit'].includes(status)) {
                        newVehicleStatus = 'On Route';
                    } else if (['delivered', 'completed', 'cancelled', 'rejected'].includes(status)) {
                        newVehicleStatus = 'Available';
                    }

                    if (newVehicleStatus) {
                        await Vehicle.findByIdAndUpdate(driverDoc.assignedVehicle, {
                            status: newVehicleStatus
                        });
                    }
                }
            } catch (vError) {
                console.error('Failed to update vehicle status:', vError);
                // Don't fail the request, just log it
            }
        }

        res.json({
            success: true,
            data: shipment
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getDistributors = async (req, res) => {
    try {
        const distributors = await User.find({ role: 'distributor' })
            .select('profile.companyName profile.fullName _id');

        res.json({
            success: true,
            data: distributors
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getTransporters = async (req, res) => {
    try {
        const transporters = await User.find({ role: 'transporter' })
            .select('profile.companyName profile.fullName _id');

        res.json({
            success: true,
            data: transporters
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
