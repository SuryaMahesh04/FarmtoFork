const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// --- Overview & Dashboard ---
router.get('/overview', adminController.getOverview);
router.get('/activity-feed', adminController.getActivityFeed);

// --- User Management ---
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id/verify', adminController.verifyUser);
router.put('/users/:id/suspend', adminController.suspendUser);
router.put('/users/:id/role', adminController.changeUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Bulk operations
router.post('/users/bulk/suspend', adminController.bulkSuspendUsers);
router.post('/users/bulk/verify', adminController.bulkVerifyUsers);
router.post('/users/bulk/delete', adminController.bulkDeleteUsers);
router.get('/approvals', adminController.getPendingApprovals);
router.put('/approvals/:id/approve', adminController.approveKyc);
router.put('/approvals/:id/reject', adminController.rejectKyc);

// --- Batch Management ---
router.get('/batches', adminController.getBatches);
router.get('/batches/:id', adminController.getBatchById);
router.put('/batches/:id/status', adminController.overrideBatchStatus);
router.delete('/batches/:id', adminController.deleteBatch);

// Bulk operations
router.post('/batches/bulk/status', adminController.bulkUpdateBatchStatus);
router.post('/batches/bulk/delete', adminController.bulkDeleteBatches);

// --- Shipment Management ---
router.get('/shipments', adminController.getShipments);
router.get('/shipments/:id', adminController.getShipmentById);
router.put('/shipments/:id/status', adminController.overrideShipmentStatus);

// Bulk operations
router.post('/shipments/bulk/status', adminController.bulkUpdateShipmentStatus);
router.post('/shipments/bulk/delete', adminController.bulkDeleteShipments);

// --- Fleet Management ---
router.get('/fleet/vehicles', adminController.getVehicles);
router.get('/fleet/drivers', adminController.getDrivers);
router.put('/fleet/drivers/:id/status', adminController.overrideDriverStatus);

// Bulk operations
router.post('/fleet/drivers/bulk/status', adminController.bulkUpdateDriverStatus);
router.post('/fleet/drivers/bulk/delete', adminController.bulkDeleteDrivers);
router.post('/fleet/vehicles/bulk/delete', adminController.bulkDeleteVehicles);

// --- Analytics ---
router.get('/analytics/users', adminController.getUserAnalytics);
router.get('/analytics/supply-chain', adminController.getSupplyChainAnalytics);
router.get('/analytics/map', adminController.getSupplyChainMapData);
router.get('/analytics/commerce', adminController.getCommerceAnalytics);
router.get('/analytics/engagement', adminController.getEngagementAnalytics);
router.get('/analytics/fleet', adminController.getFleetAnalytics);

// --- Audit Log ---
router.get('/audit-log', adminController.getAuditLog);

module.exports = router;
