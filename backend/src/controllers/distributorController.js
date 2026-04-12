const Shipment = require('../models/Shipment');
const Batch = require('../models/Batch');
const User = require('../models/User');
const Warehouse = require('../models/Warehouse');
const PurchaseOrder = require('../models/PurchaseOrder');
const crypto = require('crypto');
const Notification = require('../models/Notification');
const cryptoEngine = require('../utils/cryptoEngine');

const decryptBatch = (batchDoc) => {
    if (!batchDoc) return null;
    try {
        const b = typeof batchDoc.toObject === 'function' ? batchDoc.toObject() : batchDoc;
        
        if (b.isEncrypted) {
            let quantityCipher = undefined;
            if (b.quantity && b.quantity.ciphertext) {
                quantityCipher = b.quantity.ciphertext;
                const decryptedVal = cryptoEngine.decrypt(b.quantity);
                b.quantity = (decryptedVal === '***ENCRYPTED/CORRUPT***' || decryptedVal === null) 
                             ? 0 
                             : Number(decryptedVal) || 0;
            }
            if (b.pricePerUnit && b.pricePerUnit.ciphertext) {
                const decryptedPrice = cryptoEngine.decrypt(b.pricePerUnit);
                b.pricePerUnit = (decryptedPrice === '***ENCRYPTED/CORRUPT***' || decryptedPrice === null) 
                                 ? 0 
                                 : Number(decryptedPrice) || 0;
            }
            if (b.notes && b.notes.ciphertext) {
                b.notes = cryptoEngine.decrypt(b.notes);
            }
            if (b.location && b.location.gpsCoordinates && b.location.gpsCoordinates.ciphertext) {
                b.location.gpsCoordinates = cryptoEngine.decrypt(b.location.gpsCoordinates);
            }
            
            // Verify signature
            const farmerIdStr = typeof b.farmerId === 'object' && b.farmerId !== null 
                ? String(b.farmerId._id || b.farmerId) 
                : String(b.farmerId);
                
            const payloadToSign = {
                batchId: b.batchId,
                farmerId: farmerIdStr,
                crop: b.crop,
                quantityCipher: quantityCipher,
                previousRecordHash: b.previousRecordHash,
                timestamp: b.hashTimestamp ? new Date(b.hashTimestamp).getTime() : 0
            };
            b.isTampered = !cryptoEngine.verifySignature(payloadToSign, b.documentSignature);
        }
        return b;
    } catch (err) {
        console.error('Decryption helper error:', err);
        return batchDoc.toObject ? batchDoc.toObject() : batchDoc;
    }
};

exports.getWarehouses = async (req, res) => {
    try {
        const warehouses = await Warehouse.find({ distributor: req.user.id });
        res.status(200).json({ success: true, data: warehouses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createWarehouse = async (req, res) => {
    try {
        const warehouse = await Warehouse.create({
            ...req.body,
            distributor: req.user.id
        });
        res.status(201).json({ success: true, data: warehouse });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware

        // 1. Calculate Inventory Stats (Received Shipments)
        const inventoryShipments = await Shipment.find({
            distributor: userId,
            status: 'delivered'
        }).populate('batch');

        let totalInventoryWeight = 0;
        let qualityPassedCount = 0;
        let qualityFailedCount = 0;

        inventoryShipments.forEach(shipment => {
            if (shipment.batch) {
                shipment.batch = decryptBatch(shipment.batch);
                totalInventoryWeight += (shipment.batch.quantity || 0);
                if (shipment.batch.qualityScore >= 80) { // Assuming 80 is pass threshold
                    qualityPassedCount++;
                } else {
                    qualityFailedCount++;
                }
            }
        });

        // Calculate percentages
        const totalProcessed = qualityPassedCount + qualityFailedCount;
        const qualityPassPercentage = totalProcessed > 0
            ? Math.round((qualityPassedCount / totalProcessed) * 100)
            : 0;

        // 2. Outgoing Shipments (acquired by retailers)
        const outgoingCount = await Batch.countDocuments({
            distributorId: userId, // Assuming distributorId is tracked on batch during transit or receipt
            retailerId: { $ne: null }
        });

        // 3. Incoming Stats
        const incomingCount = await Shipment.countDocuments({
            distributor: userId,
            status: { $in: ['pending', 'accepted', 'assigned', 'in-transit'] }
        });

        // 4. Calculate Storage Utilization
        const user = await User.findById(userId);
        const capacity = user?.profile?.warehouseCapacity || 5000; // Default 5000kg if not set
        const storageUsed = Math.min(Math.round((totalInventoryWeight / capacity) * 100), 100);

        // Count Pending POs
        const pendingPOs = await PurchaseOrder.countDocuments({
            distributorId: userId,
            status: 'pending'
        });

        res.status(200).json({
            success: true,
            data: {
                totalInventory: Math.round(totalInventoryWeight),
                incomingBatches: incomingCount,
                outgoingBatches: outgoingCount,
                storageUsed: storageUsed,
                capacity: capacity,
                pendingPOs: pendingPOs
            }
        });

    } catch (error) {
        console.error('Error fetching distributor stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.getInventory = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch delivered shipments as inventory
        // Ideally, we should group by crop/variety, but listing shipments shows batches
        const inventory = await Shipment.find({
            distributor: userId,
            status: 'delivered'
        })
            .populate('batch')

            .sort({ updatedAt: -1 });

        const formattedInventory = inventory.map(item => {
            const shp = item.toObject();
            if (!shp.batch) return null;
            
            shp.batch = decryptBatch(shp.batch);
            
            // Map crop to category
            const grains = ['Wheat', 'Rice', 'Maize', 'Millets', 'Ear'];
            const vegetables = ['Tomato', 'Potato', 'Onion', 'Carrot', 'Spinach'];
            const fruits = ['Apple', 'Mango', 'Banana', 'Orange', 'Grapes'];
            const dairy = ['Milk', 'Paneer', 'Curd', 'Butter'];

            let category = 'Others';
            if (grains.some(g => shp.batch.crop && shp.batch.crop.includes(g))) category = 'Grains';
            else if (vegetables.some(v => shp.batch.crop && shp.batch.crop.includes(v))) category = 'Vegetables';
            else if (fruits.some(f => shp.batch.crop && shp.batch.crop.includes(f))) category = 'Fruits';
            else if (dairy.some(d => shp.batch.crop && shp.batch.crop.includes(d))) category = 'Dairy';

            const qty = typeof shp.batch.quantity === 'number' 
                ? shp.batch.quantity 
                : (shp.batch.quantity && !shp.batch.quantity.ciphertext ? shp.batch.quantity : '?');
            return {
                id: shp.batch.batchId ? `BTH-${shp.batch.batchId}` : String(shp.batch._id).slice(-6),
                _id: shp.batch._id,
                item: `${shp.batch.crop} (${shp.batch.variety || 'Standard'})`,
                crop: shp.batch.crop,
                category: category,
                stock: `${qty} ${shp.batch.unit || 'kg'}`,
                availableForSale: !!shp.batch.availableForSale,
                warehouse: category === 'Fruits' || category === 'Vegetables' ? 'Cold Storage (Zone A)' : (category === 'Grains' ? 'Dry Silos (Zone C)' : 'General Warehouse'),
                expiry: shp.batch.harvestDate ? new Date(new Date(shp.batch.harvestDate).setMonth(new Date(shp.batch.harvestDate).getMonth() + (category === 'Grains' ? 12 : 3))).toLocaleDateString() : 'N/A',
                status: shp.batch.qualityScore >= 80 ? 'good' : (shp.batch.qualityScore >= 60 ? 'warning' : 'critical'),
                quality: shp.batch.qualityScore || 0
            };
        }).filter(i => i !== null);

        res.status(200).json({
            success: true,
            data: formattedInventory
        });

    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.getIncoming = async (req, res) => {
    try {
        const userId = req.user.id;

        const incomingDocs = await Shipment.find({
            distributor: userId,
            status: { $in: ['pending', 'accepted', 'in-transit'] }
        })
            .populate('farmer', 'profile.fullName profile.village')
            .populate('batch')
            .sort({ createdAt: -1 });

        const incoming = incomingDocs.map(doc => {
            if (doc.batch) {
                doc.batch = decryptBatch(doc.batch);
            }
            return doc;
        });

        res.status(200).json({
            success: true,
            data: incoming
        });
    } catch (error) {
        console.error('Error fetching incoming shipments:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Inventory Trend - Aggregate delivered shipments weight by month
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentDeliveries = await Shipment.find({
            distributor: userId,
            status: 'delivered',
            updatedAt: { $gte: sixMonthsAgo }
        }).populate('batch');

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendMap = {};

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const m = monthNames[d.getMonth()];
            trendMap[m] = 0;
        }

        recentDeliveries.forEach(s => {
            if (s.batch) {
                s.batch = decryptBatch(s.batch);
                const m = monthNames[new Date(s.updatedAt).getMonth()];
                if (trendMap.hasOwnProperty(m)) {
                    trendMap[m] += s.batch.quantity;
                }
            }
        });

        const user = await User.findById(userId);
        const capacity = user?.profile?.warehouseCapacity || 5000;

        const inventoryTrendData = Object.keys(trendMap).map(m => ({
            month: m,
            stock: Math.round(trendMap[m]),
            capacity: capacity
        }));

        // Product Category Distribution
        const inventory = await Shipment.find({ distributor: userId, status: 'delivered' }).populate('batch');
        const categoryMap = {};
        const qualityByCrop = {};

        inventory.forEach(s => {
            if (s.batch) {
                const type = s.batch.crop;
                categoryMap[type] = (categoryMap[type] || 0) + s.batch.quantity;

                // Quality by Crop
                if (!qualityByCrop[type]) qualityByCrop[type] = { passed: 0, failed: 0 };
                if (s.batch.qualityScore >= 80) qualityByCrop[type].passed++;
                else qualityByCrop[type].failed++;
            }
        });

        const productCategoryData = Object.keys(categoryMap).map((key, index) => ({
            name: key,
            value: Math.round(categoryMap[key]),
            color: ['#5c9449', '#f5deb3', '#b4d7e8', '#d4a574', '#cbd5e1'][index % 5]
        }));

        const qualityMetricsData = Object.keys(qualityByCrop).map(crop => ({
            category: crop,
            passed: qualityByCrop[crop].passed,
            failed: qualityByCrop[crop].failed
        }));

        res.status(200).json({
            success: true,
            data: {
                inventoryTrend: inventoryTrendData,
                productDistribution: productCategoryData.length > 0 ? productCategoryData : [{ name: 'Empty', value: 1, color: '#e2e8f0' }],
                qualityMetrics: qualityMetricsData.length > 0 ? qualityMetricsData : [{ category: 'None', passed: 0, failed: 0 }]
            }
        });

    } catch (error) {
        console.error('Error fetching specific analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get incoming Purchase Orders from retailers
exports.getIncomingPOs = async (req, res) => {
    try {
        const posDocs = await PurchaseOrder.find({ distributorId: req.user.id })
            .populate('batchId')
            .populate('retailerId', 'profile')
            .sort({ createdAt: -1 });

        const pos = posDocs.map(po => {
            const p = po.toObject();
            if (p.batchId) {
                p.batchId = decryptBatch(p.batchId);
            }
            return p;
        });

        res.json({
            success: true,
            data: pos
        });
    } catch (error) {
        console.error('Get distributor POs error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Accept a Purchase Order
exports.acceptPO = async (req, res) => {
    try {
        const po = await PurchaseOrder.findById(req.params.id);
        if (!po) return res.status(404).json({ success: false, message: 'PO not found' });
        
        if (po.distributorId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const batch = await Batch.findById(po.batchId);
        if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

        // Update PO status
        po.status = 'accepted';
        await po.save();

        // Transfer ownership of batch to retailer
        batch.retailerId = po.retailerId;
        batch.availableForSale = false; // Hide from marketplace now that it's sold

        // Log journey
        const transactionHash = crypto.createHash('sha256').update(batch.batchId + 'po_accept' + req.user.id + Date.now()).digest('hex');
        batch.journey.push({
            stage: 'Sold to Retailer',
            timestamp: new Date(),
            location: req.user.profile?.city || 'Distribution Center',
            actorId: req.user.id,
            actorRole: 'distributor',
            details: `Batch sold to retailer per PO ${po.poNumber}`,
            transactionHash
        });

        await batch.save();

        // Notify Retailer
        try {
            await Notification.create({
                recipient: po.retailerId,
                sender: req.user.id,
                type: 'po_update',
                message: `Your Purchase Order for ${batch.crop} has been accepted`,
                relatedId: po._id,
                relatedModel: 'PurchaseOrder'
            });
        } catch (nErr) {
            console.error('Failed to notify retailer about PO acceptance:', nErr);
        }

        res.json({
            success: true,
            message: 'Purchase Order accepted and batch transferred'
        });
    } catch (error) {
        console.error('Accept PO error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reject a Purchase Order
exports.rejectPO = async (req, res) => {
    try {
        const { reason } = req.body;
        const po = await PurchaseOrder.findById(req.params.id);
        if (!po) return res.status(404).json({ success: false, message: 'PO not found' });

        if (po.distributorId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        po.status = 'rejected';
        po.rejectionReason = reason;
        await po.save();

        // Notify Retailer
        try {
            await Notification.create({
                recipient: po.retailerId,
                sender: req.user.id,
                type: 'po_update',
                message: `Your Purchase Order has been rejected: ${reason}`,
                relatedId: po._id,
                relatedModel: 'PurchaseOrder'
            });
        } catch (nErr) {
            console.error('Failed to notify retailer about PO rejection:', nErr);
        }

        res.json({
            success: true,
            message: 'Purchase Order rejected'
        });
    } catch (error) {
        console.error('Reject PO error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark batch for sale (publish to marketplace)
exports.markBatchForSale = async (req, res) => {
    try {
        const { available } = req.body;
        const batch = await Batch.findById(req.params.id);
        
        if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

        // Authorization: verify a delivered shipment exists for this distributor
        const isDelivered = await Shipment.findOne({ 
            batch: batch._id, 
            distributor: req.user.id, 
            status: 'delivered' 
        });

        if (!isDelivered) {
            return res.status(403).json({ 
                success: false, 
                message: 'No delivered shipment found for this batch' 
            });
        }

        batch.availableForSale = available;
        batch.distributorId = req.user.id; // Ensure distributorId is set for marketplace filtering
        // Clear retailerId so it shows in marketplace again (if toggling back to available)
        if (available) {
            batch.retailerId = undefined;
        }
        
        await batch.save();

        res.json({
            success: true,
            message: `Batch ${available ? 'published to' : 'removed from'} marketplace`
        });
    } catch (error) {
        console.error('Publish batch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
