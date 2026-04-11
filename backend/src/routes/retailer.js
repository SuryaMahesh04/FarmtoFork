const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getDashboardStats,
    getProducts,
    acquireBatch,
    markAvailableForSale,
    getSales,
    recordSale,
    getDistributorMarketplace,
    createPurchaseOrder,
    getMyPurchaseOrders
} = require('../controllers/retailerController');

router.use(protect);
router.use(authorize('retailer'));

router.get('/stats', getDashboardStats);
router.get('/products', getProducts);
router.post('/acquire', acquireBatch);
router.put('/:id/available', markAvailableForSale);
router.get('/sales', getSales);
router.post('/sales', recordSale);
router.get('/marketplace', getDistributorMarketplace);
router.post('/purchase-orders', createPurchaseOrder);
router.get('/purchase-orders', getMyPurchaseOrders);

module.exports = router;
