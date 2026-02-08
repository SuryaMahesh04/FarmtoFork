const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        trim: true
    },
    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true
    },
    type: {
        type: String,
        required: [true, 'Vehicle type is required']
    },
    make: {
        type: String,
        default: 'Generic'
    },
    model: {
        type: String,
        required: [true, 'Vehicle model is required']
    },
    capacity: {
        type: String,
        required: [true, 'Capacity is required']
    },
    status: {
        type: String,
        enum: ['Available', 'On Route', 'In Transit', 'Maintenance'],
        default: 'Available'
    },
    fuelType: {
        type: String,
        required: [true, 'Fuel type is required']
    },
    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null
    },
    lastServiceDate: {
        type: Date
    },
    insuranceExpiry: {
        type: Date
    },
    documents: {
        rcBook: String,
        insurance: String,
        pollution: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
