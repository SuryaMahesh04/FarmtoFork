const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createShipment,
    getShipments,
    getShipmentById,
    updateShipmentStatus,
    getDistributors,
    getTransporters
} = require('../controllers/shipmentController');

router.use(protect);

// Static routes FIRST
router.get('/distributors', getDistributors);
router.get('/transporters', getTransporters);

// Authorize all relevant roles for shared routes
router.post('/', authorize('farmer'), createShipment);
router.get('/', authorize('farmer', 'transporter', 'distributor'), getShipments);

// Parameter routes LAST
router.get('/:id', authorize('farmer', 'transporter', 'distributor'), getShipmentById);
router.put('/:id/status', authorize('transporter', 'distributor'), updateShipmentStatus);

module.exports = router;
