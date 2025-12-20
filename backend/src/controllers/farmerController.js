const Batch = require('../models/Batch');
const { generateBatchHash, generateJourneyHash } = require('../utils/hashGenerator');

// Get all batches for the logged-in farmer
exports.getBatches = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = { farmerId: req.user._id };
        if (status) query.status = status;

        const batches = await Batch.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        const count = await Batch.countDocuments(query);

        res.json({
            success: true,
            data: batches,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Get batches error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single batch details
exports.getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findOne({
            _id: req.params.id,
            farmerId: req.user._id
        }).populate('farmerId', 'profile.fullName profile.village profile.district profile.state');

        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        res.json({ success: true, data: batch });
    } catch (error) {
        console.error('Get batch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new batch
exports.createBatch = async (req, res) => {
    try {
        const {
            crop,
            variety,
            quantity,
            unit,
            harvestDate,
            pricePerUnit,
            qualityScore,
            organicCertified,
            field,
            notes
        } = req.body;

        // Generate unique batch ID
        const batchCount = await Batch.countDocuments();
        const batchId = `${String(batchCount + 1).padStart(6, '0')}`;

        // Prepare batch data
        const batchData = {
            batchId,
            farmerId: req.user._id,
            crop,
            variety,
            quantity,
            unit: unit || 'kg',
            harvestDate,
            pricePerUnit,
            totalRevenue: pricePerUnit ? pricePerUnit * quantity : 0,
            qualityScore: qualityScore || 85,
            organicCertified: organicCertified || false,
            location: {
                field,
                village: req.user.profile.village,
                district: req.user.profile.district,
                state: req.user.profile.state
            },
            notes,
            status: 'active'
        };

        // Generate blockchain hash
        const blockchainHash = generateBatchHash(batchData);
        batchData.blockchainHash = blockchainHash;
        batchData.hashTimestamp = new Date();

        // Create batch
        const batch = new Batch(batchData);

        // Add initial journey entry
        const journeyHash = generateJourneyHash({
            batchId,
            stage: 'harvested',
            farmerId: req.user._id
        });

        batch.journey.push({
            stage: 'Harvested',
            timestamp: new Date(),
            location: `${req.user.profile.village}, ${req.user.profile.district}`,
            actorId: req.user._id,
            actorRole: 'farmer',
            details: `${crop} batch created and harvested`,
            transactionHash: journeyHash
        });

        await batch.save();

        res.status(201).json({
            success: true,
            message: 'Batch created successfully',
            data: {
                batchId: batch.batchId,
                _id: batch._id,
                blockchainHash: batch.blockchainHash,
                crop: batch.crop,
                quantity: batch.quantity
            }
        });
    } catch (error) {
        console.error('Create batch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update batch
exports.updateBatch = async (req, res) => {
    try {
        const batch = await Batch.findOne({
            _id: req.params.id,
            farmerId: req.user._id
        });

        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        // Only allow updates if batch is still active
        if (batch.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Cannot update batch that is not in active status'
            });
        }

        const { pricePerUnit, qualityScore, notes, status } = req.body;

        if (pricePerUnit !== undefined) {
            batch.pricePerUnit = pricePerUnit;
            batch.totalRevenue = pricePerUnit * batch.quantity;
        }
        if (qualityScore !== undefined) batch.qualityScore = qualityScore;
        if (notes !== undefined) batch.notes = notes;
        if (status !== undefined) batch.status = status;

        await batch.save();

        res.json({
            success: true,
            message: 'Batch updated successfully',
            data: batch
        });
    } catch (error) {
        console.error('Update batch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete batch
exports.deleteBatch = async (req, res) => {
    try {
        const batch = await Batch.findOne({
            _id: req.params.id,
            farmerId: req.user._id
        });

        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        // Only allow deletion if batch is still active and has no journey beyond creation
        if (batch.status !== 'active' || batch.journey.length > 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete batch that has been processed'
            });
        }

        await batch.deleteOne();

        res.json({
            success: true,
            message: 'Batch deleted successfully'
        });
    } catch (error) {
        console.error('Delete batch error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get dashboard analytics
exports.getAnalytics = async (req, res) => {
    try {
        const farmerId = req.user._id;

        // Get all batches for this farmer
        const batches = await Batch.find({ farmerId });

        // Calculate metrics
        const totalBatches = batches.length;
        const activeBatches = batches.filter(b => b.status === 'active').length;
        const totalRevenue = batches.reduce((sum, b) => sum + (b.totalRevenue || 0), 0);
        const avgQualityScore = batches.length > 0
            ? batches.reduce((sum, b) => sum + b.qualityScore, 0) / batches.length
            : 0;

        // Crop distribution
        const cropDistribution = {};
        batches.forEach(b => {
            cropDistribution[b.crop] = (cropDistribution[b.crop] || 0) + b.quantity;
        });

        const cropDistributionData = Object.entries(cropDistribution).map(([crop, quantity]) => ({
            name: crop,
            value: quantity
        }));

        // Seasonal trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const recentBatches = batches.filter(b => new Date(b.harvestDate) >= sixMonthsAgo);

        // Group by month
        const monthlyData = {};
        recentBatches.forEach(batch => {
            const month = new Date(batch.harvestDate).toLocaleString('default', { month: 'short' });
            if (!monthlyData[month]) {
                monthlyData[month] = { batches: 0, revenue: 0 };
            }
            monthlyData[month].batches += 1;
            monthlyData[month].revenue += batch.totalRevenue || 0;
        });

        const seasonalTrendData = Object.entries(monthlyData).map(([month, data]) => ({
            name: month,
            batches: data.batches,
            revenue: data.revenue
        }));

        // Market price data (simulated for now - can be replaced with real market data)
        const marketPriceData = [
            { month: 'Jan', myPrice: 2800, marketPrice: 2650 },
            { month: 'Feb', myPrice: 2900, marketPrice: 2700 },
            { month: 'Mar', myPrice: 3100, marketPrice: 2850 },
            { month: 'Apr', myPrice: 3200, marketPrice: 2900 },
            { month: 'May', myPrice: 3300, marketPrice: 3000 },
            { month: 'Jun', myPrice: 3400, marketPrice: 3100 }
        ];

        res.json({
            success: true,
            data: {
                metrics: {
                    totalBatches,
                    activeBatches,
                    totalRevenue,
                    qualityScore: Math.round(avgQualityScore)
                },
                cropDistribution: cropDistributionData,
                seasonalTrends: seasonalTrendData,
                marketPrices: marketPriceData
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
