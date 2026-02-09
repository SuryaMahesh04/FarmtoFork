const express = require('express');
const router = express.Router();
const {
    createDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    deleteDriver,
    assignVehicle,
    updateDutyStatus,
    updateLocation,
    getDutyStatus
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Driver-specific routes (accessible by drivers)
router.put('/duty-status', authorize('driver'), updateDutyStatus);
router.put('/location', authorize('driver'), updateLocation);
router.get('/me/status', authorize('driver'), getDutyStatus);

// Transporter routes (require 'transporter' role)
router.use(authorize('transporter'));

router.route('/')
    .post(createDriver)
    .get(getAllDrivers);

router.route('/:id')
    .get(getDriverById)
    .put(updateDriver)
    .delete(deleteDriver);

router.put('/:id/assign-vehicle', assignVehicle);

module.exports = router;
