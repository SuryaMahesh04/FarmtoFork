const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats, getInventory, getIncoming, getAnalytics } = require('../controllers/distributorController');

// All routes are protected and only for distributors
router.use(protect);
router.use(authorize('distributor'));

router.get('/stats', getDashboardStats);
router.get('/inventory', getInventory);
router.get('/incoming', getIncoming);
router.get('/analytics', getAnalytics);

module.exports = router;
