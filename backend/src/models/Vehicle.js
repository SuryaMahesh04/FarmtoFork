const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true
    },
    type: {
        type: String,
        required: [true, 'Vehicle type is required'],
        enum: ['Truck', 'Van', 'Mini Truck', 'Container', 'Other']
    },
    model: {
        type: String,
        required: [true, 'Vehicle model is required']
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity (in kg) is required']
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'ON ROUTE', 'MAINTENANCE'],
        default: 'AVAILABLE'
    },
    fuelType: {
        type: String,
        required: [true, 'Fuel type is required']
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
