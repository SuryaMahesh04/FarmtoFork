const Batch = require('../models/Batch');
const { generateBatchHash, generateJourneyHash } = require('../utils/hashGenerator');
const cryptoEngine = require('../utils/cryptoEngine');

// Helper to decrypt and verify
const decryptBatch = (batchDoc) => {
    const b = typeof batchDoc.toObject === 'function' ? batchDoc.toObject() : batchDoc;
    if (b.isEncrypted) {
        let quantityCipher = undefined;
        if (b.quantity && b.quantity.ciphertext) {
            quantityCipher = b.quantity.ciphertext;
            b.quantity = Number(cryptoEngine.decrypt(b.quantity)) || 0;
        }
        if (b.pricePerUnit && b.pricePerUnit.ciphertext) {
            b.pricePerUnit = Number(cryptoEngine.decrypt(b.pricePerUnit)) || 0;
        }
        if (b.notes && b.notes.ciphertext) {
            b.notes = cryptoEngine.decrypt(b.notes);
        }
        
        // Verify signature
        const farmerIdStr = typeof b.farmerId === 'object' && b.farmerId !== null 
            ? String(b.farmerId._id) 
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
};

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
        const decryptedBatches = batches.map(decryptBatch);

        res.json({
            success: true,
            data: decryptedBatches,
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

        const decryptedBatch = decryptBatch(batch);

        res.json({ success: true, data: decryptedBatch });
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
        
        // Find previous record to link the hash chain
        const lastBatch = await Batch.findOne().sort({ createdAt: -1 });
        const previousRecordHash = lastBatch ? (lastBatch.documentSignature || lastBatch.blockchainHash || '0') : '0';

        // Encrypt sensitive data
        const encryptedQuantity = cryptoEngine.encrypt(quantity);
        const encryptedPrice = pricePerUnit ? cryptoEngine.encrypt(pricePerUnit) : undefined;
        const encryptedNotes = notes ? cryptoEngine.encrypt(notes) : undefined;

        // Prepare batch data
        const batchData = {
            batchId,
            farmerId: req.user._id,
            crop,
            cropHash: cryptoEngine.generateBlindIndex(crop),
            variety,
            quantity: encryptedQuantity,
            unit: unit || 'kg',
            harvestDate,
            pricePerUnit: encryptedPrice,
            totalRevenue: pricePerUnit ? pricePerUnit * quantity : 0,
            qualityScore: qualityScore || 85,
            organicCertified: organicCertified || false,
            location: {
                field,
                village: req.user.profile.village,
                district: req.user.profile.district,
                state: req.user.profile.state
            },
            notes: encryptedNotes,
            status: 'active',
            isEncrypted: true,
            qrGenerated: true,
            previousRecordHash
        };

        const hashTimestamp = new Date();
        batchData.hashTimestamp = hashTimestamp;

        // Sign the core payload
        const payloadToSign = {
            batchId: batchData.batchId,
            farmerId: String(batchData.farmerId),
            crop: batchData.crop,
            quantityCipher: encryptedQuantity.ciphertext,
            previousRecordHash: batchData.previousRecordHash,
            timestamp: hashTimestamp.getTime()
        };
        batchData.documentSignature = cryptoEngine.signPayload(payloadToSign);
        
        // Generate legacy blockchain hash for backward compatibility tracking
        const blockchainPayload = { ...batchData, quantity }; // Send plaintext for hashing just for legacy
        batchData.blockchainHash = generateBatchHash(blockchainPayload);

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
                documentSignature: batch.documentSignature,
                crop: batch.crop,
                quantity: quantity // Return plaintext for UI immediate use
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

        if (batch.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'Cannot update batch that is not in active status'
            });
        }

        const { pricePerUnit, qualityScore, notes, status, qrGenerated } = req.body;

        // If price changes, we update the encrypted payload and total revenue
        if (pricePerUnit !== undefined) {
            batch.pricePerUnit = cryptoEngine.encrypt(pricePerUnit);
            
            // Need original quantity to calculate revenue
            let originalQuantity = 0;
            if (batch.quantity && batch.quantity.ciphertext) {
                originalQuantity = Number(cryptoEngine.decrypt(batch.quantity)) || 0;
            } else {
                originalQuantity = Number(batch.quantity) || 0; // fallback if not encrypted
            }
            batch.totalRevenue = pricePerUnit * originalQuantity;
        }
        
        if (qualityScore !== undefined) batch.qualityScore = qualityScore;
        if (notes !== undefined) batch.notes = cryptoEngine.encrypt(notes);
        if (status !== undefined) batch.status = status;
        if (qrGenerated !== undefined) batch.qrGenerated = qrGenerated;

        // Re-sign if core fields changed? Currently we don't allow modifying quantity/crop to maintain chain integrity.
        // If we allowed it, we'd have to regenerate the signature, which might break chains if strictly linked.

        await batch.save();

        res.json({
            success: true,
            message: 'Batch updated successfully',
            data: decryptBatch(batch)
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
        const farmerId = req.user.id || req.user._id;
        
        // Month names for mapping
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Get all batches for this farmer
        const rawBatches = await Batch.find({ farmerId });
        const batches = rawBatches.map(decryptBatch);

        // Get all shipments for this farmer
        const Shipment = require('../models/Shipment');
        const shipments = await Shipment.find({ farmer: farmerId });

        // Calculate basic metrics
        const totalBatches = batches.length;
        const totalShipments = shipments.length;
        const activeShipments = shipments.filter(s => s.status !== 'delivered' && s.status !== 'rejected').length;
        const totalRevenue = batches.reduce((sum, b) => sum + (Number(b.totalRevenue) || 0), 0);
        
        // Integrity Score (Percentage of verified batches)
        const tamperedCount = batches.filter(b => b.isTampered).length;
        const integrityScore = totalBatches > 0 
            ? Math.floor(((totalBatches - tamperedCount) / totalBatches) * 100) 
            : 100;

        // Shared aggregation containers
        const harvestVolumeTrend = {};
        const revenueTrend = {};
        const cropDistribution = {};
        const qualityRanges = { '90+': 0, '80-89': 0, '70-79': 0, '<70': 0 };
        const integrityStatus = { verified: 0, tampered: 0 };

        batches.forEach(b => {
            const date = b.harvestDate ? new Date(b.harvestDate) : new Date(b.createdAt);
            const mIdx = date.getMonth();
            const mName = months[mIdx];
            const qty = Number(b.quantity) || 0;
            
            // 1. Harvest & Revenue Volume (Monthly Trends)
            harvestVolumeTrend[mName] = (harvestVolumeTrend[mName] || 0) + qty;
            revenueTrend[mName] = (revenueTrend[mName] || 0) + (Number(b.totalRevenue) || 0);

            // 2. Crop Distribution (All active inventory)
            if (['active', 'in-transit', 'assigned'].includes(b.status || 'active')) {
                const cropName = b.crop || 'Unknown';
                cropDistribution[cropName] = (cropDistribution[cropName] || 0) + qty;
            }

            // 3. Quality Analysis
            const score = Number(b.qualityScore) || 0;
            if (score >= 90) qualityRanges['90+']++;
            else if (score >= 80) qualityRanges['80-89']++;
            else if (score >= 70) qualityRanges['70-79']++;
            else qualityRanges['<70']++;

            // 4. Integrity Status
            if (b.isTampered) integrityStatus.tampered++;
            else integrityStatus.verified++;
        });

        // Format chart data for the last 6 months
        const currentMonthIdx = new Date().getMonth();
        const last6MonthNames = [];
        for (let i = 5; i >= 0; i--) {
            last6MonthNames.push(months[(currentMonthIdx - i + 12) % 12]);
        }

        const harvestVolumeData = last6MonthNames.map(m => ({
            name: m,
            value: Math.round(harvestVolumeTrend[m] || 0)
        }));

        const revenueTrendData = last6MonthNames.map(m => ({
            name: m,
            revenue: Math.round(revenueTrend[m] || 0)
        }));

        const cropDistributionData = Object.entries(cropDistribution).map(([name, value]) => ({
            name,
            value: Math.round(value)
        }));

        const qualityDistributionData = Object.entries(qualityRanges).map(([name, value]) => ({
            name,
            value
        }));

        const integrityData = [
            { name: 'Verified', value: integrityStatus.verified },
            { name: 'Tampered', value: integrityStatus.tampered }
        ];

        res.json({
            success: true,
            data: {
                metrics: {
                    totalBatches,
                    totalShipments,
                    activeShipments,
                    totalRevenue: Math.round(totalRevenue),
                    integrityScore: integrityScore
                },
                cropDistribution: cropDistributionData,
                harvestVolume: harvestVolumeData,
                revenueTrend: revenueTrendData,
                qualityDistribution: qualityDistributionData,
                integrityStatus: integrityData
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
