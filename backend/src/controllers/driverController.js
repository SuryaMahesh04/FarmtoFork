const mongoose = require('mongoose');
const Driver = require('../models/Driver');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const crypto = require('crypto');

// Helper to generate random password
const generatePassword = (length = 10) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// @desc    Register new driver
// @route   POST /api/drivers
// @access  Private (Transporter only)
exports.createDriver = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            email,
            licenseNumber,
            licenseExpiry,
            address,
            assignedVehicleId
        } = req.body;

        // Check if driver with email or license already exists
        const existingDriver = await Driver.findOne({
            $or: [{ email }, { licenseNumber }]
        });

        if (existingDriver) {
            return res.status(400).json({
                success: false,
                message: 'Driver with this email or license number already exists'
            });
        }

        // Check if user account exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User account with this email already exists'
            });
        }

        // Generate random password
        const password = generatePassword(10);

        // Create User account for driver
        const user = await User.create({
            email,
            password,
            role: 'driver',
            isVerified: true, // Auto-verify drivers created by transporters
            profile: {
                fullName,
                mobile: phone,
                licenseNumber,
                licenseExpiry,
                transporterId: req.user.id,
                assignedVehicleId,
                address
            }
        });

        // Create Driver record
        const driver = await Driver.create({
            user: user._id,
            transporter: req.user.id,
            fullName,
            phone,
            email,
            licenseNumber,
            licenseExpiry,
            address,
            assignedVehicle: assignedVehicleId || null,
            status: 'Active'
        });

        // If vehicle assigned, update vehicle status/driver
        /* 
        if (assignedVehicleId) {
            // Update vehicle logic here if needed
        } 
        */

        res.status(201).json({
            success: true,
            message: 'Driver created successfully',
            data: {
                driver,
                credentials: {
                    email,
                    password
                }
            }
        });

    } catch (error) {
        console.error('Create Driver Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};

// @desc    Get all drivers for transporter
// @route   GET /api/drivers
// @access  Private (Transporter only)
exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find({ transporter: req.user.id })
            .populate('assignedVehicle', 'registrationNumber type model make')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: drivers.length,
            data: drivers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Private (Transporter only)
exports.getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findOne({
            _id: req.params.id,
            transporter: req.user.id
        }).populate('assignedVehicle');

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        res.json({
            success: true,
            data: driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private (Transporter only)
exports.updateDriver = async (req, res) => {
    try {
        let driver = await Driver.findOne({
            _id: req.params.id,
            transporter: req.user.id
        });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        // Update fields
        driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Also update the User profile if key details changed
        await User.findByIdAndUpdate(driver.user, {
            'profile.fullName': req.body.fullName || driver.fullName,
            'profile.mobile': req.body.phone || driver.phone,
            'profile.licenseNumber': req.body.licenseNumber || driver.licenseNumber
        });

        res.json({
            success: true,
            data: driver
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private (Transporter only)
exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findOne({
            _id: req.params.id,
            transporter: req.user.id
        });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        // Deactivate user account instead of full delete to preserve history
        await User.findByIdAndUpdate(driver.user, { isActive: false });

        // Mark driver as inactive
        driver.status = 'Inactive';
        driver.assignedVehicle = null; // Unassign vehicle
        await driver.save();

        res.json({
            success: true,
            message: 'Driver deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Assign vehicle to driver
// @route   PUT /api/drivers/:id/assign-vehicle
// @access  Private (Transporter only)
exports.assignVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.body;

        const driver = await Driver.findOne({
            _id: req.params.id,
            transporter: req.user.id
        });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver not found'
            });
        }

        const Vehicle = require('../models/Vehicle');

        // Unassign from previous vehicle if any
        if (driver.assignedVehicle) {
            await Vehicle.findByIdAndUpdate(driver.assignedVehicle, { assignedDriver: null });
        }

        // If assigning to a new vehicle
        if (vehicleId) {
            // Check if vehicle exists and belongs to transporter
            const vehicle = await Vehicle.findOne({ _id: vehicleId, transporter: req.user.id });
            if (!vehicle) {
                return res.status(404).json({ success: false, message: 'Vehicle not found' });
            }

            // If this vehicle is already assigned to ANOTHER driver, unassign that driver
            if (vehicle.assignedDriver && vehicle.assignedDriver.toString() !== driver._id.toString()) {
                await Driver.findByIdAndUpdate(vehicle.assignedDriver, { assignedVehicle: null });
            }

            // Assign driver to vehicle
            vehicle.assignedDriver = driver._id;
            await vehicle.save();
        }

        driver.assignedVehicle = vehicleId || null;
        await driver.save();

        // Update User profile too
        await User.findByIdAndUpdate(driver.user, {
            'profile.assignedVehicleId': vehicleId
        });

        const updatedDriver = await Driver.findById(driver._id).populate('assignedVehicle');

        res.json({
            success: true,
            data: updatedDriver,
            message: vehicleId ? 'Vehicle assigned successfully' : 'Vehicle unassigned successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
