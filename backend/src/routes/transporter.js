const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/transporterController');

// All routes are protected and restricted to transporters
router.use(protect);
router.use(authorize('transporter'));

/**
 * @route   GET /api/transporter/stats
 */
router.get('/stats', getDashboardStats);

module.exports = router;
