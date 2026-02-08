const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createShipment,
    getShipments,
    getShipmentById,
    updateShipmentStatus,
    assignDriver,
    getDistributors,
    getTransporters
} = require('../controllers/shipmentController');

router.use(protect);

// Static routes FIRST
router.get('/distributors', getDistributors);
router.get('/transporters', getTransporters);

// Authorize all relevant roles for shared routes
router.post('/', authorize('farmer'), createShipment);
router.get('/', authorize('farmer', 'transporter', 'distributor', 'driver'), getShipments); // Added 'driver'

// Parameter routes LAST
router.put('/:id/assign', authorize('transporter'), assignDriver); // Assign Driver
router.get('/:id', authorize('farmer', 'transporter', 'distributor', 'driver'), getShipmentById); // Added 'driver'
router.put('/:id/status', authorize('transporter', 'distributor', 'driver'), updateShipmentStatus); // Added 'driver'

module.exports = router;
