const Batch = require('../models/Batch');
const ConsumerScan = require('../models/ConsumerScan');
const { decrypt } = require('../utils/cryptoEngine');

/**
 * Helper to decrypt batch specific fields
 */
const decryptBatchData = (batch) => {
    if (!batch) return null;
    try {
        const decryptedBatch = batch.toObject ? batch.toObject() : { ...batch };
        
        if (decryptedBatch.quantity && typeof decryptedBatch.quantity === 'object') {
            decryptedBatch.quantity = decrypt(decryptedBatch.quantity);
        }
        if (decryptedBatch.pricePerUnit && typeof decryptedBatch.pricePerUnit === 'object') {
            decryptedBatch.pricePerUnit = decrypt(decryptedBatch.pricePerUnit);
        }
        if (decryptedBatch.location?.gpsCoordinates && typeof decryptedBatch.location.gpsCoordinates === 'object') {
            decryptedBatch.location.gpsCoordinates = decrypt(decryptedBatch.location.gpsCoordinates);
        }
        if (decryptedBatch.notes && typeof decryptedBatch.notes === 'object') {
            decryptedBatch.notes = decrypt(decryptedBatch.notes);
        }
        
        return decryptedBatch;
    } catch (err) {
        console.error('Decryption error on batch:', err);
        return batch;
    }
};

exports.getTraceData = async (req, res) => {
    try {
        const { batchId } = req.params;

        // Fetch the batch logic
        // Support searching by Mongo _id or custom batchId
        let query = {};
        if (batchId.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: batchId };
        } else {
            query = { batchId: batchId };
        }

        const batch = await Batch.findOne(query)
            .populate('farmerId', 'profile.fullName profile.village profile.district profile.state profile.address');

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: 'Traceability data not found for this product.'
            });
        }

        // Increment scan count asynchronously
        Batch.updateOne({ _id: batch._id }, { $inc: { scanCount: 1 } }).catch(console.error);

        const decryptedBatch = decryptBatchData(batch);

        // Sanitize data - we might not want to expose sensitive financial data publicly
        if (decryptedBatch.pricePerUnit) {
            delete decryptedBatch.pricePerUnit;
        }
        if (decryptedBatch.totalRevenue) {
            delete decryptedBatch.totalRevenue;
        }

        res.json({
            success: true,
            data: decryptedBatch
        });

    } catch (error) {
        console.error('Trace data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve traceability data'
        });
    }
};

// Track a consumer scan
exports.trackConsumerScan = async (req, res) => {
    try {
        const { deviceId, userId, batchId, isTampered, location } = req.body;
        
        if (!deviceId || !batchId) {
            return res.status(400).json({ success: false, message: 'Missing deviceId or batchId' });
        }

        // Verify batch exists
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        // Check for recent duplicates (within last 10 seconds) to handle React 18 strict mode double-firing
        // or rapid accidental double-clicks/scans.
        const tenSecondsAgo = new Date(Date.now() - 10000);
        const duplicateQuery = {
            deviceId,
            batchId,
            scannedAt: { $gte: tenSecondsAgo }
        };
        
        // If userId is provided, include it in the duplicate check for more precision
        if (userId) {
            duplicateQuery.userId = userId;
        }

        const existingScan = await ConsumerScan.findOne(duplicateQuery);

        if (existingScan) {
            return res.status(200).json({ 
                success: true, 
                message: 'Scan already registered recently',
                isExisting: true 
            });
        }

        const scan = new ConsumerScan({
            deviceId,
            userId: userId || null,
            batchId,
            isTampered: !!isTampered,
            location
        });

        await scan.save();

        res.status(201).json({ success: true, message: 'Scan tracked successfully' });
    } catch (error) {
        console.error('Error tracking consumer scan:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getConsumerQuery = (deviceId, userId = null) => {
    if (userId) {
        return { $or: [{ deviceId }, { userId }] };
    }
    return { deviceId };
};

// Get aggregated consumer metrics
exports.getConsumerMetrics = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { userId } = req.query;
        
        const scans = await ConsumerScan.find(getConsumerQuery(deviceId, userId)).populate({
            path: 'batchId',
            populate: { path: 'farmerId', select: 'profile.fullName profile.state' }
        });

        const totalVerified = scans.length;
        const counterfeits = scans.filter(s => s.isTampered).length;
        
        const farmerCounts = {};
        scans.forEach(s => {
            const batch = s.batchId;
            if (batch && batch.farmerId && batch.farmerId.profile) {
                const name = batch.farmerId.profile.fullName;
                farmerCounts[name] = (farmerCounts[name] || 0) + 1;
            }
        });

        const uniqueFarms = Object.keys(farmerCounts).length;
        
        let favouriteFarm = 'None yet';
        let maxFarm = 0;
        for (const [farm, count] of Object.entries(farmerCounts)) {
            if (count > maxFarm) {
                maxFarm = count;
                favouriteFarm = farm;
            }
        }

        res.json({
            success: true,
            data: {
                totalVerified,
                counterfeits,
                uniqueFarms,
                favouriteFarm
            }
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ success: false });
    }
};

// Get Full History
exports.getConsumerHistory = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { userId } = req.query;
        const scans = await ConsumerScan.find(getConsumerQuery(deviceId, userId))
            .sort({ scannedAt: -1 })
            .populate({
                path: 'batchId',
                populate: { path: 'farmerId', select: 'profile.fullName profile.village profile.district profile.state' }
            });
            
        // Map to expected format
        const history = scans.map(s => {
            const batch = s.batchId;
            if (!batch) return null;
            return {
                _id: s._id,
                batchId: batch.batchId || batch._id,
                batchMongoId: batch._id,
                crop: batch.crop,
                variety: batch.variety,
                farmerName: batch.farmerId?.profile?.fullName || 'Unknown Farmer',
                location: `${batch.farmerId?.profile?.district || 'Unknown'}, ${batch.farmerId?.profile?.state || ''}`,
                isTampered: s.isTampered,
                timestamp: s.scannedAt
            };
        }).filter(Boolean);

        res.json({ success: true, data: history });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ success: false });
    }
};

// Get Farms Explored
exports.getConsumerFarms = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { userId } = req.query;
        const scans = await ConsumerScan.find(getConsumerQuery(deviceId, userId))
            .populate({
                path: 'batchId',
                populate: { path: 'farmerId', select: 'profile.fullName profile.village profile.district profile.state' }
            });
            
        const farmsMap = {};
        scans.forEach(s => {
            const batch = s.batchId;
            if (batch && batch.farmerId && batch.farmerId._id) {
                const fId = batch.farmerId._id.toString();
                if (!farmsMap[fId]) {
                    farmsMap[fId] = {
                        farmerId: fId,
                        farmerName: batch.farmerId.profile?.fullName,
                        location: `${batch.farmerId.profile?.district}, ${batch.farmerId.profile?.state}`,
                        scanCount: 1,
                        lastScanned: s.scannedAt,
                        crops: [batch.crop]
                    };
                } else {
                    farmsMap[fId].scanCount += 1;
                    if (s.scannedAt > farmsMap[fId].lastScanned) {
                        farmsMap[fId].lastScanned = s.scannedAt;
                    }
                    if (!farmsMap[fId].crops.includes(batch.crop)) {
                        farmsMap[fId].crops.push(batch.crop);
                    }
                }
            }
        });

        const farms = Object.values(farmsMap).sort((a,b) => b.scanCount - a.scanCount);

        res.json({ success: true, data: farms });
    } catch (error) {
        console.error('Error fetching farms:', error);
        res.status(500).json({ success: false });
    }
};

// Get Tampered Alerts
exports.getConsumerAlerts = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { userId } = req.query;
        const scans = await ConsumerScan.find({ ...getConsumerQuery(deviceId, userId), isTampered: true })
            .sort({ scannedAt: -1 })
            .populate({
                path: 'batchId',
                populate: { path: 'farmerId', select: 'profile.fullName profile.village profile.district profile.state' }
            });
            
        // Map to expected format
        const alerts = scans.map(s => {
            const batch = s.batchId;
            if (!batch) return null;
            return {
                _id: s._id,
                batchId: batch.batchId || batch._id,
                batchMongoId: batch._id,
                crop: batch.crop,
                variety: batch.variety,
                farmerName: batch.farmerId?.profile?.fullName || 'Unknown Farmer',
                location: `${batch.farmerId?.profile?.district || 'Unknown'}, ${batch.farmerId?.profile?.state || ''}`,
                timestamp: s.scannedAt
            };
        }).filter(Boolean);

        res.json({ success: true, data: alerts });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ success: false });
    }
};

// ElevenLabs Voice Session URL (Securely fetches signed url on server side to hide API Key)
exports.getVoiceSession = async (req, res) => {
    try {
        const agentId = process.env.ELEVENLABS_AGENT_ID;
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!agentId || !apiKey) {
            return res.status(500).json({ success: false, message: 'ElevenLabs credentials not configured' });
        }

        const response = await fetch(
            `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
            {
                headers: { 'xi-api-key': apiKey }
            }
        );

        if (!response.ok) {
            console.error('ElevenLabs API error', response.status, await response.text());
            return res.status(response.status).json({ success: false, message: 'Failed to fetch signed url from ElevenLabs' });
        }

        const data = await response.json();
        res.json({ success: true, signedUrl: data.signed_url });
    } catch (error) {
        console.error('Error fetching voice session:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
