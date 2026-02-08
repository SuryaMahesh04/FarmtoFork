const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require 'transporter' role
router.use(protect);
router.use(authorize('transporter'));

router.route('/')
    .post(vehicleController.createVehicle)
    .get(vehicleController.getVehicles);

router.route('/:id')
    .get(vehicleController.getVehicleById)
    .put(vehicleController.updateVehicle)
    .delete(vehicleController.deleteVehicle);

module.exports = router;
