const Shipment = require('../models/Shipment');
const Batch = require('../models/Batch');
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.createShipment = async (req, res) => {
    try {
        const { batchId, distributorId, transporterId } = req.body;
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
        }

        const shipments = await Shipment.find(query)
            .populate('farmer', 'profile.fullName profile.address profile.village profile.district profile.city profile.state')
            .populate('batch', 'batchId crop variety quantity')
            .populate('distributor', 'profile.companyName profile.fullName profile.address profile.city profile.state')
            .populate('transporter', 'profile.companyName profile.fullName profile.address profile.city profile.state')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: shipments
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
            .populate('transporter', 'profile.companyName profile.fullName profile.address profile.city profile.state');

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        res.json({
            success: true,
            data: shipment
        });
    } catch (error) {
        console.error('Get shipment details error:', error);
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
            .populate('transporter', 'profile.companyName profile.fullName profile.address profile.city profile.state');

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        // Verify if user is authorized involved party
        if (shipment.transporter._id.toString() !== userId && shipment.distributor._id.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Fetch current user (Distributor/Transporter) to get name for notes/notifications
        const currentUser = await User.findById(userId);
        const actionerName = currentUser?.profile?.companyName || currentUser?.profile?.fullName || 'Partner';

        // IDEMPOTENCY CHECK: Prevent duplicate updates
        if (status === 'accepted') {
            // Check IDs using _id.toString() because they are populated objects now
            if ((shipment.transporter._id.toString() === userId && shipment.transporterStatus === 'accepted') ||
                (shipment.distributor._id.toString() === userId && shipment.distributorStatus === 'accepted')) {
                return res.json({ success: true, data: shipment, message: 'Already accepted' });
            }
        } else if (status === 'rejected') {
            if ((shipment.transporter._id.toString() === userId && shipment.transporterStatus === 'rejected') ||
                (shipment.distributor._id.toString() === userId && shipment.distributorStatus === 'rejected')) {
                return res.json({ success: true, data: shipment, message: 'Already rejected' });
            }
        } else {
            // For general status updates, check if already in that status
            if (shipment.status === status) {
                return res.json({ success: true, data: shipment, message: `Already in ${status} status` });
            }
        }

        // helpers to get location string
        const getFarmerLocation = () => {
            // ... existing logic works with populated objects too
            const addr = shipment.farmer?.profile?.address;
            return addr?.city || addr?.formattedAddress || shipment.farmer?.profile?.city || 'Farm Location';
        };

        const getDistributorLocation = () => {
            const addr = shipment.distributor?.profile?.address;
            return addr?.city || addr?.formattedAddress || shipment.distributor?.profile?.city || 'Distributor Warehouse';
        };

        let updateLocation = 'System Update';
        let updateNotes = `Status updated to ${status} by ${actionerName}`;

        // Handle Acceptance Phase (Granular)
        if (status === 'accepted') {
            if (shipment.transporter._id.toString() === userId) {
                shipment.transporterStatus = 'accepted';
            } else if (shipment.distributor._id.toString() === userId) {
                shipment.distributorStatus = 'accepted';
            }

            // Check if BOTH have accepted to move global status
            if (shipment.transporterStatus === 'accepted' && shipment.distributorStatus === 'accepted') {
                shipment.status = 'accepted';
                updateLocation = 'Virtual Handshake';
                updateNotes = 'Both parties accepted. Ready for pickup.';

                shipment.trackingUpdates.push({
                    status: 'accepted',
                    location: updateLocation,
                    notes: updateNotes
                });
            } else {
                // One party accepted, still pending global acceptance
                shipment.trackingUpdates.push({
                    status: 'pending',
                    location: 'System Update',
                    notes: `${actionerName} accepted the request. Waiting for other party.`
                });
            }
        } else if (status === 'rejected' || status === 'declined') {
            // Handle Rejection
            if (shipment.transporter._id.toString() === userId) {
                shipment.transporterStatus = 'rejected';
            } else if (shipment.distributor._id.toString() === userId) {
                shipment.distributorStatus = 'rejected';
            }

            // If any party rejects, the shipment is effectively rejected/cancelled
            shipment.status = 'rejected';
            shipment.trackingUpdates.push({
                status: 'rejected',
                location: 'System Update',
                notes: `Shipment rejected by ${actionerName}`
            });
        } else {
            // Normal flow for subsequent statuses (at_pickup, picked_up, etc.)
            shipment.status = status;

            // Determine Location based on Status
            if (status === 'at_pickup' || status === 'picked_up') {
                updateLocation = getFarmerLocation();
            } else if (status === 'in-transit') {
                updateLocation = 'En Route';
            } else if (status === 'delivered') {
                updateLocation = getDistributorLocation();
            }

            shipment.trackingUpdates.push({
                status: status,
                location: updateLocation,
                notes: updateNotes
            });
        }

        await shipment.save();

        // Re-fetch with full population to ensure frontend gets complete data (Safeguard against Mongoose depopulation on save)
        const updatedShipment = await Shipment.findById(id)
            .populate('farmer', 'profile.fullName profile.mobile profile.address profile.village profile.district profile.city profile.state')
            .populate('batch')
            .populate('distributor', 'profile.companyName profile.fullName profile.address profile.city profile.state profile.district')
            .populate('transporter', 'profile.companyName profile.fullName profile.address profile.city profile.state');

        // Notify Farmer
        await Notification.create({
            recipient: shipment.farmer._id,
            sender: userId,
            type: 'shipment_update',
            message: `${actionerName} marked shipment as ${status === 'accepted' ? 'accepted' : status.replace('_', ' ')}`,
            relatedId: shipment._id,
            relatedModel: 'Shipment'
        });

        res.json({
            success: true,
            data: updatedShipment
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
