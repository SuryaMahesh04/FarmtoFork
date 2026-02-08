const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    shipmentId: {
        type: String,
        required: true,
        unique: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    distributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    driverStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    transporterStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    distributorStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'assigned', 'at_pickup', 'picked_up', 'in-transit', 'delivered', 'rejected'],
        default: 'pending'
    },
    trackingUpdates: [{
        status: String,
        location: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        notes: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Shipment', shipmentSchema);
