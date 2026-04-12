const express = require('express');
const router = express.Router();
const {
    getTraceData,
    trackConsumerScan,
    getConsumerMetrics,
    getConsumerHistory,
    getConsumerFarms,
    getConsumerAlerts
} = require('../controllers/publicController');

// Public route for tracing product by QR code
router.get('/trace/:batchId', getTraceData);

// Consumer tracking routes
router.post('/consumer/scan', trackConsumerScan);
router.get('/consumer/:deviceId/metrics', getConsumerMetrics);
router.get('/consumer/:deviceId/history', getConsumerHistory);
router.get('/consumer/:deviceId/farms', getConsumerFarms);
router.get('/consumer/:deviceId/alerts', getConsumerAlerts);

module.exports = router;
