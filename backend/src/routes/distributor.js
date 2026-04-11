const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
    getDashboardStats, 
    getInventory, 
    getIncoming, 
    getAnalytics, 
    getWarehouses, 
    createWarehouse,
    getIncomingPOs,
    acceptPO,
    rejectPO,
    markBatchForSale
} = require('../controllers/distributorController');

// All routes are protected and only for distributors
router.use(protect);
router.use(authorize('distributor'));

router.get('/stats', getDashboardStats);
router.get('/inventory', getInventory);
router.get('/incoming', getIncoming);
router.get('/analytics', getAnalytics);
router.get('/warehouses', getWarehouses);
router.post('/warehouses', createWarehouse);
router.get('/purchase-orders', getIncomingPOs);
router.put('/purchase-orders/:id/accept', acceptPO);
router.put('/purchase-orders/:id/reject', rejectPO);
router.put('/inventory/:id/publish', markBatchForSale);

module.exports = router;
