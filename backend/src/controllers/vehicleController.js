const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// @desc    Register new vehicle
// @route   POST /api/vehicles
// @access  Private (Transporter only)
exports.createVehicle = async (req, res) => {
    try {
        const {
            name,
            registrationNumber,
            type,
            make,
            model,
            capacity,
            fuelType
        } = req.body;

        const existingVehicle = await Vehicle.findOne({ registrationNumber });
        if (existingVehicle) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle with this registration number already exists'
            });
        }

        const vehicle = await Vehicle.create({
            transporter: req.user.id,
            name,
            registrationNumber,
            type,
            make,
            model,
            capacity,
            fuelType,
            status: 'Available'
        });

        res.status(201).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all vehicles for transporter
// @route   GET /api/vehicles
// @access  Private (Transporter only)
exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ transporter: req.user.id })
            .populate({
                path: 'assignedDriver',
                select: 'fullName phone email profile',
                populate: { path: 'user', select: 'profile' } // Deep populate if needed, but Driver model has fullName/phone directly too
            })
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private (Transporter only)
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({
            _id: req.params.id,
            transporter: req.user.id
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        res.json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Transporter only)
exports.updateVehicle = async (req, res) => {
    try {
        let vehicle = await Vehicle.findOne({
            _id: req.params.id,
            transporter: req.user.id
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Transporter only)
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({
            _id: req.params.id,
            transporter: req.user.id
        });

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }

        // Check if assigned
        if (vehicle.assignedDriver) {
            // Unassign from driver
            await Driver.findByIdAndUpdate(vehicle.assignedDriver, { assignedVehicle: null });
        }

        await vehicle.deleteOne();

        res.json({
            success: true,
            message: 'Vehicle removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
