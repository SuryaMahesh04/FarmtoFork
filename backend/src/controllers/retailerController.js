const Batch = require('../models/Batch');
const RetailSale = require('../models/RetailSale');
const PurchaseOrder = require('../models/PurchaseOrder');
const cryptoEngine = require('../utils/cryptoEngine');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

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

// @desc    Get retailer dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const retailerId = req.user._id;

        // Fetch products owned by retailer
        const rawBatches = await Batch.find({ retailerId });
        const batches = rawBatches.map(decryptBatch);

        const totalProducts = batches.length;
        
        // Calculate low stock (arbitrary < 20 threshold, depends on unit)
        // Since we don't strictly deduct stock automatically on old models, we use sales simulation
        
        const lowStockBatches = batches.filter(b => b.quantity < 20);

        // Fetch sales
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sales = await RetailSale.find({ retailerId }).populate('batchId', 'crop variety');
        const salesToday = sales.filter(s => new Date(s.timestamp) >= today).length;

        // Aggregate scans
        const totalScans = batches.reduce((sum, b) => sum + (b.scanCount || 0), 0);

        // Calculate Weekly Sales Trend mock vs real data integration
        const weeklyData = [
            { day: 'Mon', sales: 0, revenue: 0 },
            { day: 'Tue', sales: 0, revenue: 0 },
            { day: 'Wed', sales: 0, revenue: 0 },
            { day: 'Thu', sales: 0, revenue: 0 },
            { day: 'Fri', sales: 0, revenue: 0 },
            { day: 'Sat', sales: 0, revenue: 0 },
            { day: 'Sun', sales: 0, revenue: 0 }
        ];

        // This would ideally group by specific days. We'll leave it as zero'd out structure for UI, mapping real data where it exists.
        sales.forEach(s => {
            const dayIdx = new Date(s.timestamp).getDay(); 
            // 0 is Sunday, map to our array where Sun is index 6
            const mappedIdx = dayIdx === 0 ? 6 : dayIdx - 1; 
            weeklyData[mappedIdx].sales += s.quantitySold;
            weeklyData[mappedIdx].revenue += s.salePrice;
        });

        const topMap = {};
        sales.forEach(s => {
            const cropName = s.batchId && typeof s.batchId === 'object' ? s.batchId.crop : 'Product';
            topMap[cropName] = (topMap[cropName] || 0) + s.quantitySold;
        });
        
        const topProducts = Object.keys(topMap).map(k => ({ product: k, sales: topMap[k] }))
            .sort((a,b) => b.sales - a.sales).slice(0, 4);
            
        const stockLevels = [
            { name: 'In Stock', value: batches.length - lowStockBatches.length, color: '#5c9449' },
            { name: 'Low Stock', value: lowStockBatches.length, color: '#f59e0b' },
            { name: 'Out of Stock', value: 0, color: '#d4a574' }
        ];

        // Aggregate sales metrics
        const unitsSold = sales.reduce((sum, s) => sum + (s.quantitySold || 0), 0);
        const totalRevenue = sales.reduce((sum, s) => sum + (s.salePrice || 0), 0);

        res.json({
            success: true,
            data: {
                totalProducts,
                unitsSold,
                totalRevenue: Math.round(totalRevenue),
                consumerScans: totalScans,
                weeklyData,
                stockLevels,
                topProducts
            }
        });
    } catch (error) {
        console.error('Get retailer stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all products for retailer
exports.getProducts = async (req, res) => {
    try {
        const retailerId = req.user._id;
        const rawBatches = await Batch.find({ retailerId }).sort({ createdAt: -1 });
        const batches = rawBatches.map(decryptBatch);

        res.json({
            success: true,
            data: batches
        });
    } catch (error) {
        console.error('Get retailer products error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Acquire a batch
exports.acquireBatch = async (req, res) => {
    try {
        const { batchId } = req.body;

        let query = mongoose.Types.ObjectId.isValid(batchId) ? { _id: batchId } : { batchId: String(batchId).replace('BTH-', '') };

        const batch = await Batch.findOne(query);

        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        if (batch.retailerId) {
            return res.status(400).json({ success: false, message: 'Batch is already owned by a retailer' });
        }

        batch.retailerId = req.user._id;
        
        const transactionHash = crypto.createHash('sha256').update(batch.batchId + 'retail_acquire' + req.user._id + Date.now()).digest('hex');
        batch.journey.push({
            stage: 'Received at Retail',
            timestamp: new Date(),
            location: req.user.profile?.storeAddress || req.user.profile?.city || 'Retail Store',
            actorId: req.user._id,
            actorRole: 'retailer',
            details: `Received into inventory by ${req.user.profile?.storeName || 'Retailer'}`,
            transactionHash
        });

        await batch.save();

        res.json({
            success: true,
            message: 'Batch acquired successfully'
        });
    } catch (error) {
        console.error('Acquire batch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all available products from distributors (Marketplace)
exports.getDistributorMarketplace = async (req, res) => {
    try {
        // Find batches owned by distributors marked as available for sale
        // Handle both null and non-existent retailerId
        const rawBatches = await Batch.find({ 
            availableForSale: true,
            $or: [
                { retailerId: { $exists: false } },
                { retailerId: null }
            ]
        }).populate('farmerId', 'profile');

        const batches = rawBatches.map(decryptBatch);

        res.json({
            success: true,
            data: batches
        });
    } catch (error) {
        console.error('Get marketplace error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a Purchase Order
exports.createPurchaseOrder = async (req, res) => {
    try {
        const { batchId, quantityRequested, priceOffered, notes } = req.body;

        const batch = await Batch.findById(batchId);
        if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

        // distributorId should be stored on the batch when distributor acquires it
        // If not found, we can't place order
        if (!batch.journey.some(j => j.actorRole === 'distributor')) {
            return res.status(400).json({ success: false, message: 'Batch is not currently held by a distributor' });
        }
        
        const lastDistributor = batch.journey.filter(j => j.actorRole === 'distributor').pop();

        const po = new PurchaseOrder({
            retailerId: req.user._id,
            distributorId: lastDistributor.actorId,
            batchId,
            quantityRequested: Number(quantityRequested),
            priceOffered: Number(priceOffered),
            notes
        });

        await po.save();

        // Notify Distributor
        try {
            await Notification.create({
                recipient: lastDistributor.actorId,
                sender: req.user._id,
                type: 'purchase_order',
                message: `New Purchase Order request from ${req.user.profile?.storeName || 'Retailer'}`,
                relatedId: po._id,
                relatedModel: 'PurchaseOrder'
            });
        } catch (nErr) {
            console.error('Failed to send PO notification:', nErr);
        }

        res.status(201).json({
            success: true,
            message: 'Purchase Order created successfully',
            data: po
        });
    } catch (error) {
        console.error('Create PO error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my Purchase Orders
exports.getMyPurchaseOrders = async (req, res) => {
    try {
        const posDocs = await PurchaseOrder.find({ retailerId: req.user._id })
            .populate('batchId')
            .populate('distributorId', 'profile')
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
        console.error('Get my POs error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Mark available for sale
exports.markAvailableForSale = async (req, res) => {
    try {
        const batch = await Batch.findOne({ _id: req.params.id, retailerId: req.user._id });

        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        batch.availableForSale = true;
        
        // Append to journey
        const transactionHash = crypto.createHash('sha256').update(batch.batchId + 'retail_available' + req.user._id + Date.now()).digest('hex');
        batch.journey.push({
            stage: 'Available at Retail',
            timestamp: new Date(),
            location: req.user.profile?.storeAddress || req.user.profile?.city || 'Retail Store',
            actorId: req.user._id,
            actorRole: 'retailer',
            details: `Product is available for consumer purchase`,
            transactionHash
        });

        await batch.save();

        res.json({
            success: true,
            message: 'Batch marked as available for sale'
        });
    } catch (error) {
        console.error('Mark available error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get sales history
exports.getSales = async (req, res) => {
    try {
        const retailerId = req.user._id;
        const salesDocs = await RetailSale.find({ retailerId })
            .populate('batchId')
            .sort({ timestamp: -1 });

        const sales = salesDocs.map(sale => {
            const s = sale.toObject();
            if (s.batchId) {
                s.batchId = decryptBatch(s.batchId);
            }
            return s;
        });

        res.json({
            success: true,
            data: sales
        });
    } catch (error) {
        console.error('Get sales error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Simulate/Record a retail sale
exports.recordSale = async (req, res) => {
    try {
        const { batchId, quantitySold, salePrice, consumerName } = req.body;

        const sale = new RetailSale({
            retailerId: req.user._id,
            batchId,
            quantitySold: Number(quantitySold),
            salePrice: Number(salePrice),
            consumerName: consumerName || 'Anonymous'
        });

        await sale.save();

        res.status(201).json({
            success: true,
            message: 'Sale recorded successfully',
            data: sale
        });
    } catch (error) {
        console.error('Record sale error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
