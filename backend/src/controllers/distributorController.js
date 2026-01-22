const Shipment = require('../models/Shipment');
const Batch = require('../models/Batch');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware

        // 1. Calculate Inventory Stats (Received Shipments)
        const inventoryShipments = await Shipment.find({
            distributor: userId,
            status: 'delivered'
        }).populate('batch');

        let totalInventoryWeight = 0;
        let storageUsed = 0; // maintain as % if capacity is known, else just number
        let qualityPassedCount = 0;
        let qualityFailedCount = 0;

        inventoryShipments.forEach(shipment => {
            if (shipment.batch) {
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

        // 2. Calculate Incoming Stats
        const incomingCount = await Shipment.countDocuments({
            distributor: userId,
            status: { $in: ['pending', 'accepted', 'in-transit'] }
        });

        res.status(200).json({
            success: true,
            data: {
                totalInventory: totalInventoryWeight,
                incomingBatches: incomingCount,
                qualityScore: qualityPassPercentage,
                storageUsed: 75 // Mocked for now as we don't have max capacity in User model easily accessible or updated
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
            .populate({
                path: 'batch',
                select: 'batchId crop variety quantity unit harvestDate qualityScore status'
            })
            .sort({ updatedAt: -1 });

        const formattedInventory = inventory.map(item => {
            if (!item.batch) return null;
            return {
                id: item.batch.formattedId, // Virtual
                _id: item.batch._id, // Real ID for linking
                item: `${item.batch.crop} (${item.batch.variety})`,
                stock: `${item.batch.quantity} ${item.batch.unit}`,
                warehouse: 'Main Warehouse', // Default
                expiry: new Date(new Date(item.batch.harvestDate).setFullYear(new Date(item.batch.harvestDate).getFullYear() + 1)).toLocaleDateString(), // Mock expiry = harvest + 1 yr
                status: item.batch.qualityScore > 80 ? 'good' : (item.batch.qualityScore > 50 ? 'warning' : 'critical'),
                quality: item.batch.qualityScore
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

        const incoming = await Shipment.find({
            distributor: userId,
            status: { $in: ['pending', 'accepted', 'in-transit'] }
        })
            .populate('farmer', 'profile.fullName profile.village')
            .populate('batch', 'batchId crop quantity unit status')
            .sort({ createdAt: -1 });

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

        // Mocking some chart data based on real aggregations if possible, otherwise realistic mocks
        // Inventory Trend (Mocked as real historical data is hard to derive without a history table)
        const inventoryTrendData = [
            { month: 'Jul', stock: 500, capacity: 1000 },
            { month: 'Aug', stock: 650, capacity: 1000 },
            { month: 'Sep', stock: 700, capacity: 1000 },
            { month: 'Oct', stock: 600, capacity: 1000 },
            { month: 'Nov', stock: 800, capacity: 1000 },
            { month: 'Dec', stock: 950, capacity: 1000 }
        ];

        // Product Category Distribution
        const inventory = await Shipment.find({ distributor: userId, status: 'delivered' }).populate('batch');
        const categoryMap = {};

        inventory.forEach(s => {
            if (s.batch) {
                const type = s.batch.crop;
                // Simple mapping or just use crop name
                categoryMap[type] = (categoryMap[type] || 0) + s.batch.quantity;
            }
        });

        const productCategoryData = Object.keys(categoryMap).map((key, index) => ({
            name: key,
            value: categoryMap[key],
            color: ['#5c9449', '#f5deb3', '#b4d7e8', '#d4a574', '#cbd5e1'][index % 5]
        }));

        // Quality Metrics
        const qualityMetricsData = [
            { category: 'All', passed: 0, failed: 0 }
        ];
        // We can make this per crop if we want, but simple for now
        inventory.forEach(s => {
            if (s.batch) {
                if (s.batch.qualityScore >= 80) qualityMetricsData[0].passed += s.batch.quantity;
                else qualityMetricsData[0].failed += s.batch.quantity;
            }
        });

        res.status(200).json({
            success: true,
            data: {
                inventoryTrend: inventoryTrendData,
                productDistribution: productCategoryData.length > 0 ? productCategoryData : [{ name: 'Empty', value: 1, color: '#e2e8f0' }],
                qualityMetrics: qualityMetricsData
            }
        });

    } catch (error) {
        console.error('Error fetching specific analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
}
