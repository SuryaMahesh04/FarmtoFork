const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    distributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        city: String,
        state: String,
        address: String,
        pincode: String
    },
    capacity: {
        type: Number,
        required: true // in kg
    },
    type: {
        type: String,
        enum: [
            'Cold Storage', 'Dry Warehouse', 'Silo', 'Frozen Storage', 
            'Climate Controlled', 'Bonded', 'Distribution Center', 
            'Cross-Dock', 'Hazardous', 'Automated', 'General'
        ],
        default: 'General'
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'inactive'],
        default: 'active'
    },
    zones: [{
        name: String,
        type: String,
        capacity: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
