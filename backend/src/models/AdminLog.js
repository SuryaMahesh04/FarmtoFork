const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'USER_SUSPENDED',
            'USER_ACTIVATED',
            'USER_VERIFIED',
            'USER_ROLE_CHANGED',
            'USER_DELETED',
            'USER_CREATED',
            'BATCH_STATUS_OVERRIDE',
            'BATCH_DELETED',
            'SHIPMENT_STATUS_OVERRIDE',
            'DRIVER_STATUS_OVERRIDE',
            'KYC_APPROVED',
            'KYC_REJECTED'
        ]
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    targetModel: {
        type: String,
        required: true,
        enum: ['User', 'Batch', 'Shipment', 'Driver', 'Vehicle']
    },
    details: {
        type: String, // E.g., "Changed status from active to suspended"
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed // For storing before/after states if needed
    }
}, {
    timestamps: true
});

// Index for getting logs chronologically or by admin
adminLogSchema.index({ createdAt: -1 });
adminLogSchema.index({ adminId: 1, createdAt: -1 });

module.exports = mongoose.model('AdminLog', adminLogSchema);
