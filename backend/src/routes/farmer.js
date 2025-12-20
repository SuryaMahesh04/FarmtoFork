const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const farmerController = require('../controllers/farmerController');

// All routes require authentication and farmer role
router.use(protect);
router.use(authorize('farmer'));

// Batch management
router.get('/batches', farmerController.getBatches);
router.get('/batches/:id', farmerController.getBatchById);
router.post('/batches', farmerController.createBatch);
router.put('/batches/:id', farmerController.updateBatch);
router.delete('/batches/:id', farmerController.deleteBatch);

// Analytics
router.get('/analytics', farmerController.getAnalytics);

module.exports = router;
