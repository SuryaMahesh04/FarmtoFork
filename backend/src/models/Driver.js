const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: [true, 'Driver name is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    licenseNumber: {
        type: String,
        required: [true, 'License number is required'],
        unique: true
    },
    licenseExpiry: {
        type: Date,
        required: [true, 'License expiry date is required']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: {
            type: String,
            default: 'India'
        }
    },
    assignedVehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'On Leave'],
        default: 'Active'
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster lookups
driverSchema.index({ transporter: 1 });
driverSchema.index({ licenseNumber: 1 });
driverSchema.index({ email: 1 });

module.exports = mongoose.model('Driver', driverSchema);
