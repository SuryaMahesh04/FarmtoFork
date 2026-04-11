const User = require('../models/User');
const Batch = require('../models/Batch');
const Shipment = require('../models/Shipment');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const ConsumerScan = require('../models/ConsumerScan');
const RetailSale = require('../models/RetailSale');
const AdminLog = require('../models/AdminLog');
const Notification = require('../models/Notification');
const cryptoEngine = require('../utils/cryptoEngine');

// Helper for audit logging
const logAdminAction = async (adminId, action, targetId, targetModel, details, metadata = {}) => {
    try {
        await AdminLog.create({
            adminId,
            action,
            targetId,
            targetModel,
            details,
            metadata
        });
    } catch (error) {
        console.error('Failed to log admin action:', error);
    }
};

// Helper: Decrypt batch data
const decryptBatch = (batchDoc) => {
    const b = typeof batchDoc.toObject === 'function' ? batchDoc.toObject() : batchDoc;
    if (b.isEncrypted) {
        let quantityCipher = undefined;
        if (b.quantity && b.quantity.ciphertext) {
            quantityCipher = b.quantity.ciphertext;
            b.quantity = Number(cryptoEngine.decrypt(b.quantity)) || 0;
        }
        if (b.pricePerUnit && b.pricePerUnit.ciphertext) {
            b.pricePerUnit = Number(cryptoEngine.decrypt(b.pricePerUnit)) || 0;
        }
        if (b.notes && b.notes.ciphertext) {
            b.notes = cryptoEngine.decrypt(b.notes);
        }
        const farmerIdStr = typeof b.farmerId === 'object' && b.farmerId !== null 
            ? String(b.farmerId._id) 
            : String(b.farmerId);
        const payloadToSign = {
            batchId: b.batchId,
            farmerId: farmerIdStr,
            crop: b.crop,
            quantityCipher: quantityCipher,
            previousRecordHash: b.previousRecordHash,
            timestamp: b.hashTimestamp ? new Date(b.hashTimestamp).getTime() : 0
        };
        b.isTampered = !cryptoEngine.verifySignature(payloadToSign, b.documentSignature);
    }
    return b;
};

// --- Overview & Dashboard ---
exports.getOverview = async (req, res) => {
    try {
        const [
            totalUsers,
            farmers,
            batches,
            activeBatches,
            tamperedBatches,
            shipments,
            sales,
            scans,
            pendingApprovals
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'farmer' }),
            Batch.countDocuments(),
            Batch.countDocuments({ status: 'active' }),
            ConsumerScan.countDocuments({ isTampered: true }),
            Shipment.countDocuments({ status: { $in: ['in-transit', 'pending', 'assigned'] } }),
            RetailSale.aggregate([{ $group: { _id: null, totalGMV: { $sum: { $multiply: ["$quantitySold", "$salePrice"] } } } }]),
            ConsumerScan.countDocuments(),
            User.countDocuments({ isVerified: false, role: { $ne: 'admin' } })
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                farmers,
                totalBatches: batches,
                activeBatches,
                tamperedBatches,
                activeShipments: shipments,
                platformGMV: sales.length > 0 ? sales[0].totalGMV : 0,
                consumerScans: scans,
                pendingApprovals,
                uptime: '99.8%'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getActivityFeed = async (req, res) => {
    try {
        // Fetch latest events from multiple collections
        const [users, batches, shipments, scans] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(5).select('email role createdAt profile.fullName'),
            Batch.find().sort({ createdAt: -1 }).limit(5).select('batchId crop status createdAt farmerId').populate('farmerId', 'profile.fullName'),
            Shipment.find().sort({ updatedAt: -1 }).limit(5).select('shipmentId status updatedAt'),
            ConsumerScan.find().sort({ scannedAt: -1 }).limit(5).select('batchId isTampered scannedAt').populate('batchId', 'batchId crop')
        ]);

        let feed = [];
        users.forEach(u => feed.push({ type: 'user', icon: 'UserPlus', message: `New ${u.role} registered: ${u.profile?.fullName || u.email}`, time: u.createdAt }));
        batches.forEach(b => feed.push({ type: 'batch', icon: 'PackagePlus', message: `Batch ${b.batchId} (${b.crop}) created by ${b.farmerId?.profile?.fullName || 'Unknown'}`, time: b.createdAt }));
        shipments.forEach(s => feed.push({ type: 'shipment', icon: 'Truck', message: `Shipment ${s.shipmentId} updated to ${s.status}`, time: s.updatedAt }));
        scans.forEach(s => feed.push({ type: s.isTampered ? 'alert' : 'scan', icon: s.isTampered ? 'AlertTriangle' : 'QrCode', message: `Batch ${s.batchId?.batchId || 'Unknown'} scanned ${s.isTampered ? '(TAMPERED!)' : ''}`, time: s.scannedAt }));

        feed.sort((a, b) => b.time - a.time);
        
        res.json({ success: true, data: feed.slice(0, 20) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- User Management ---
exports.getUsers = async (req, res) => {
    try {
        const { role, status, search, page = 1, limit = 20 } = req.query;
        let query = {};
        
        if (role && role !== 'all') query.role = role;
        if (status === 'suspended') query.isActive = false;
        if (status === 'unverified') query.isVerified = false;
        if (status === 'active') { query.isActive = true; query.isVerified = true; }

        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { 'profile.fullName': { $regex: search, $options: 'i' } },
                { 'profile.companyName': { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-password');
            
        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: users,
            pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        let extras = {};
        if (user.role === 'farmer') {
            extras.batchesCount = await Batch.countDocuments({ farmerId: user._id });
        } else if (user.role === 'transporter') {
            extras.vehiclesCount = await Vehicle.countDocuments({ transporter: user._id });
            extras.driversCount = await Driver.countDocuments({ transporter: user._id });
        }

        res.json({ success: true, data: { ...user.toObject(), stats: extras } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createUser = async (req, res) => {
    // Basic implementation for manual creation. Full implementation in authController.register
    try {
        const { email, password, role, profile } = req.body;
        const user = await User.create({ email, password, role, profile, isVerified: true });
        await logAdminAction(req.user._id, 'USER_CREATED', user._id, 'User', `Admin manually created ${role} user`);
        res.status(201).json({ success: true, data: { id: user._id, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.verifyUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        await logAdminAction(req.user._id, 'USER_VERIFIED', user._id, 'User', `Verified KYC for user ${user.email}`);
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.suspendUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        user.isActive = !user.isActive; // Toggle
        await user.save();
        
        const action = user.isActive ? 'USER_ACTIVATED' : 'USER_SUSPENDED';
        await logAdminAction(req.user._id, action, user._id, 'User', `Toggled active status to ${user.isActive} for ${user.email}`);
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        await logAdminAction(req.user._id, 'USER_ROLE_CHANGED', user._id, 'User', `Changed role to ${role}`);
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        await logAdminAction(req.user._id, 'USER_DELETED', user._id, 'User', `Hard deleted user ${user.email}`);
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Bulk User Management ---
exports.bulkSuspendUsers = async (req, res) => {
    try {
        const { userIds, action } = req.body; // action: 'suspend' or 'activate'
        if (!userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ success: false, message: 'Invalid user IDs' });
        }

        const activeStatus = action === 'activate';
        await User.updateMany({ _id: { $in: userIds } }, { isActive: activeStatus });
        
        await logAdminAction(req.user._id, `BULK_USER_${action.toUpperCase()}`, null, 'User', `Bulk ${action} applied to ${userIds.length} users`, { userIds });
        
        res.json({ success: true, message: `Successfully ${action}ed ${userIds.length} users` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.bulkVerifyUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ success: false, message: 'Invalid user IDs' });
        }

        await User.updateMany({ _id: { $in: userIds } }, { isVerified: true });
        
        await logAdminAction(req.user._id, 'BULK_USER_VERIFIED', null, 'User', `Bulk verified ${userIds.length} users`, { userIds });
        
        res.json({ success: true, message: `Successfully verified ${userIds.length} users` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.bulkDeleteUsers = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ success: false, message: 'Invalid user IDs' });
        }

        await User.deleteMany({ _id: { $in: userIds } });
        
        await logAdminAction(req.user._id, 'BULK_USER_DELETED', null, 'User', `Bulk hard deleted ${userIds.length} users`, { userIds });
        
        res.json({ success: true, message: `Successfully deleted ${userIds.length} users` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Approvals ---
exports.getPendingApprovals = async (req, res) => {
    try {
        const users = await User.find({ isVerified: false, role: { $ne: 'admin' } }).select('-password');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.approveKyc = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
        await logAdminAction(req.user._id, 'KYC_APPROVED', user._id, 'User', `Approved KYC for ${user.email}`);
        await Notification.create({
            recipient: user._id,
            title: 'Account Approved',
            message: 'Your platform account has been verified and approved.',
            type: 'system'
        });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.rejectKyc = async (req, res) => {
    try {
        const { reason } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        await logAdminAction(req.user._id, 'KYC_REJECTED', user._id, 'User', `Rejected KYC for ${user.email}. Reason: ${reason}`);
        // Can't send in-app notification if deactivated usually, maybe send email in real implementation
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Batch Management ---
exports.getBatches = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        let query = {};
        
        if (status && status !== 'all') query.status = status;
        if (search) {
            query.$or = [
                { batchId: { $regex: search, $options: 'i' } },
                { crop: { $regex: search, $options: 'i' } }
            ];
        }

        const batches = await Batch.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('farmerId', 'profile.fullName email');
            
        const decryptedBatches = batches.map(decryptBatch);
        const total = await Batch.countDocuments(query);

        res.json({
            success: true,
            data: decryptedBatches,
            pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id).populate('farmerId', '-password');
        if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
        res.json({ success: true, data: decryptBatch(batch) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.overrideBatchStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const batch = await Batch.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
        await logAdminAction(req.user._id, 'BATCH_STATUS_OVERRIDE', batch._id, 'Batch', `Changed status to ${status}`);
        res.json({ success: true, data: batch });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findByIdAndDelete(req.params.id);
        if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
        await logAdminAction(req.user._id, 'BATCH_DELETED', batch._id, 'Batch', `Force deleted batch ${batch.batchId}`);
        res.json({ success: true, message: 'Batch deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Bulk Batch Management ---
exports.bulkUpdateBatchStatus = async (req, res) => {
    try {
        const { batchIds, status } = req.body;
        if (!batchIds || !Array.isArray(batchIds)) {
            return res.status(400).json({ success: false, message: 'Invalid batch IDs' });
        }

        await Batch.updateMany({ _id: { $in: batchIds } }, { status });
        
        await logAdminAction(req.user._id, 'BULK_BATCH_STATUS_UPDATE', null, 'Batch', `Bulk status update to ${status} for ${batchIds.length} batches`, { batchIds });
        
        res.json({ success: true, message: `Successfully updated ${batchIds.length} batches to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.bulkDeleteBatches = async (req, res) => {
    try {
        const { batchIds } = req.body;
        if (!batchIds || !Array.isArray(batchIds)) {
            return res.status(400).json({ success: false, message: 'Invalid batch IDs' });
        }

        await Batch.deleteMany({ _id: { $in: batchIds } });
        
        await logAdminAction(req.user._id, 'BULK_BATCH_DELETED', null, 'Batch', `Bulk hard deleted ${batchIds.length} batches`, { batchIds });
        
        res.json({ success: true, message: `Successfully deleted ${batchIds.length} batches` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Shipment Management ---
exports.getShipments = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        let query = {};
        if (status && status !== 'all') query.status = status;

        const shipments = await Shipment.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('farmer', 'profile.fullName')
            .populate('transporter', 'profile.companyName')
            .populate('distributor', 'profile.companyName')
            .populate({ path: 'batch', select: 'batchId crop isEncrypted quantity pricePerUnit notes previousRecordHash documentSignature farmerId hashTimestamp' }); // Only needed fields to decrypt for crop name
            
        // Post populate decryption for batch crop
        const processedShipments = shipments.map(s => {
           let doc = s.toObject();
           if(doc.batch) {
               doc.batch = decryptBatch(doc.batch);
           }
           return doc;
        });

        const total = await Shipment.countDocuments(query);
        res.json({
            success: true,
            data: processedShipments,
            pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id)
            .populate('farmer')
            .populate('transporter')
            .populate('driver')
            .populate('distributor')
            .populate('batch');
        if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
        
        let doc = shipment.toObject();
        if(doc.batch) doc.batch = decryptBatch(doc.batch);

        res.json({ success: true, data: doc });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.overrideShipmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const shipment = await Shipment.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
        await logAdminAction(req.user._id, 'SHIPMENT_STATUS_OVERRIDE', shipment._id, 'Shipment', `Changed status to ${status}`);
        res.json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Bulk Shipment Management ---
exports.bulkUpdateShipmentStatus = async (req, res) => {
    try {
        const { shipmentIds, status } = req.body;
        if (!shipmentIds || !Array.isArray(shipmentIds)) {
            return res.status(400).json({ success: false, message: 'Invalid shipment IDs' });
        }

        await Shipment.updateMany({ _id: { $in: shipmentIds } }, { status });
        
        await logAdminAction(req.user._id, 'BULK_SHIPMENT_STATUS_UPDATE', null, 'Shipment', `Bulk status update to ${status} for ${shipmentIds.length} shipments`, { shipmentIds });
        
        res.json({ success: true, message: `Successfully updated ${shipmentIds.length} shipments to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.bulkDeleteShipments = async (req, res) => {
    try {
        const { shipmentIds } = req.body;
        if (!shipmentIds || !Array.isArray(shipmentIds)) {
            return res.status(400).json({ success: false, message: 'Invalid shipment IDs' });
        }

        await Shipment.deleteMany({ _id: { $in: shipmentIds } });
        
        await logAdminAction(req.user._id, 'BULK_SHIPMENT_DELETED', null, 'Shipment', `Bulk hard deleted ${shipmentIds.length} shipments`, { shipmentIds });
        
        res.json({ success: true, message: `Successfully deleted ${shipmentIds.length} shipments` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Fleet Management ---
exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
            .populate('transporter', 'profile.companyName email')
            .populate('assignedDriver', 'fullName phone');
        res.json({ success: true, data: vehicles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find()
            .populate('transporter', 'profile.companyName email')
            .populate('assignedVehicle', 'registrationNumber type status');
        res.json({ success: true, data: drivers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.overrideDriverStatus = async (req, res) => {
    try {
        const { dutyStatus } = req.body;
        const driver = await Driver.findByIdAndUpdate(req.params.id, { dutyStatus }, { new: true });
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        await logAdminAction(req.user._id, 'DRIVER_STATUS_OVERRIDE', driver._id, 'Driver', `Changed duty status to ${dutyStatus}`);
        res.json({ success: true, data: driver });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Bulk Fleet Management ---
exports.bulkUpdateDriverStatus = async (req, res) => {
    try {
        const { driverIds, dutyStatus } = req.body;
        if (!driverIds || !Array.isArray(driverIds)) {
            return res.status(400).json({ success: false, message: 'Invalid driver IDs' });
        }

        await Driver.updateMany({ _id: { $in: driverIds } }, { dutyStatus });
        
        await logAdminAction(req.user._id, 'BULK_DRIVER_STATUS_UPDATE', null, 'Driver', `Bulk duty status update to ${dutyStatus} for ${driverIds.length} drivers`, { driverIds });
        
        res.json({ success: true, message: `Successfully updated ${driverIds.length} drivers to ${dutyStatus}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.bulkDeleteDrivers = async (req, res) => {
    try {
        const { driverIds } = req.body;
        if (!driverIds || !Array.isArray(driverIds)) {
            return res.status(400).json({ success: false, message: 'Invalid driver IDs' });
        }

        await Driver.deleteMany({ _id: { $in: driverIds } });
        
        await logAdminAction(req.user._id, 'BULK_DRIVER_DELETED', null, 'Driver', `Bulk hard deleted ${driverIds.length} drivers`, { driverIds });
        
        res.json({ success: true, message: `Successfully deleted ${driverIds.length} drivers` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.bulkDeleteVehicles = async (req, res) => {
    try {
        const { vehicleIds } = req.body;
        if (!vehicleIds || !Array.isArray(vehicleIds)) {
            return res.status(400).json({ success: false, message: 'Invalid vehicle IDs' });
        }

        await Vehicle.deleteMany({ _id: { $in: vehicleIds } });
        
        await logAdminAction(req.user._id, 'BULK_VEHICLE_DELETED', null, 'Vehicle', `Bulk hard deleted ${vehicleIds.length} vehicles`, { vehicleIds });
        
        res.json({ success: true, message: `Successfully deleted ${vehicleIds.length} vehicles` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Analytics ---
exports.getUserAnalytics = async (req, res) => {
    try {
        const roles = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);
        
        // Mock 6 month trend for demo purposes, complex mongo aggregation otherwise
        const userGrowth = [
            { name: 'Jan', value: 850 }, { name: 'Feb', value: 920 },
            { name: 'Mar', value: 1050 }, { name: 'Apr', value: 1100 },
            { name: 'May', value: 1200 }, { name: 'Jun', value: await User.countDocuments() }
        ];

        res.json({ success: true, data: { roles, userGrowth } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getSupplyChainAnalytics = async (req, res) => {
   try {
        const batchStatus = await Batch.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const shipmentVolume = [
            { name: 'W1', value: 45 }, { name: 'W2', value: 52 },
            { name: 'W3', value: 38 }, { name: 'W4', value: await Shipment.countDocuments() }
        ];
        res.json({ success: true, data: { batchStatus, shipmentVolume } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCommerceAnalytics = async (req, res) => {
    try {
        // Return mock data for commerce until we have more sales data
        res.json({ success: true, data: { 
            revenueTrend: [{name:'Jan', value:12000}, {name:'Feb', value:15000}, {name:'Mar', value:18000}],
            topCrops: [{name:'Wheat', value:45000}, {name:'Rice', value:38000}, {name:'Corn', value:21000}]
        }});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getEngagementAnalytics = async (req, res) => {
     try {
        const tamperEvents = await ConsumerScan.countDocuments({ isTampered: true });
        res.json({ success: true, data: { 
            scanTrend: [{name:'Mon', value:120}, {name:'Tue', value:150}, {name:'Wed', value:180}],
            tamperEvents
        }});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFleetAnalytics = async (req, res) => {
    try {
        const vehicleStatus = await Vehicle.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const driverDutyStatus = await Driver.aggregate([
            { $group: { _id: "$dutyStatus", count: { $sum: 1 } } }
        ]);
        res.json({ success: true, data: { vehicleStatus, driverDutyStatus } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Audit Log ---
exports.getAuditLog = async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const logs = await AdminLog.find()
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('adminId', 'email profile.fullName');
            
        const total = await AdminLog.countDocuments();
        
        res.json({ 
            success: true, 
            data: logs,
            pagination: { total, page: Number(page), pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Global Map Analytics ---
exports.getSupplyChainMapData = async (req, res) => {
    try {
        // 1. Fetch Users with location data (Farmers, Transporters, Distributors, Retailers)
        const users = await User.find({
            role: { $in: ['farmer', 'transporter', 'distributor', 'retailer'] },
            'profile.address.coordinates.lat': { $exists: true },
            isActive: true
        }).select('role profile.fullName profile.companyName profile.storeName profile.city profile.address.coordinates profile.mobile');

        const mapUsers = users.map(user => ({
            id: user._id,
            type: user.role,
            name: user.profile.companyName || user.profile.storeName || user.profile.fullName,
            city: user.profile.city,
            coordinates: {
                lat: user.profile.address.coordinates.lat,
                lng: user.profile.address.coordinates.lng
            },
            contact: user.profile.mobile,
            details: user.role === 'farmer' ? `Farmer: ${user.profile.fullName}` : 
                     user.role === 'retailer' ? `Store: ${user.profile.storeName}` : 
                     `Company: ${user.profile.companyName}`
        }));

        // 2. Fetch Drivers with live location data
        const drivers = await Driver.find({
            'currentLocation.lat': { $exists: true },
            status: 'Active'
        }).select('fullName phone dutyStatus currentLocation assignedVehicle').populate('assignedVehicle', 'registrationNumber');

        const mapDrivers = drivers.map(driver => ({
            id: driver._id,
            type: 'driver',
            name: driver.fullName,
            status: driver.dutyStatus,
            coordinates: {
                lat: driver.currentLocation.lat,
                lng: driver.currentLocation.lng
            },
            contact: driver.phone,
            details: `Vehicle: ${driver.assignedVehicle?.registrationNumber || 'No vehicle'}`,
            updatedAt: driver.currentLocation.updatedAt || driver.updatedAt
        }));

        res.json({
            success: true,
            data: [...mapUsers, ...mapDrivers]
        });
    } catch (error) {
        console.error('Map Analytics Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
