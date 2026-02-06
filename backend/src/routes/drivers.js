const express = require('express');
const router = express.Router();
const { 
    createDriver, 
    getAllDrivers, 
    getDriverById, 
    updateDriver, 
    deleteDriver, 
    assignVehicle 
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require 'transporter' role
router.use(protect);
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
