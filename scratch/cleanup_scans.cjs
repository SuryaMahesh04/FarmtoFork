const mongoose = require('mongoose');
const ConsumerScan = require('../backend/src/models/ConsumerScan');
require('dotenv').config({ path: '../backend/.env' });

async function cleanupDuplicates() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const scans = await ConsumerScan.find().sort({ scannedAt: 1 });
        const toDeleteIds = [];
        const seen = new Set();

        scans.forEach(scan => {
            // Create a unique key for device + batch + rounded time (within 10s)
            const timeKey = Math.floor(scan.scannedAt.getTime() / 10000); 
            const key = `${scan.deviceId}_${scan.batchId}_${timeKey}`;
            
            if (seen.has(key)) {
                toDeleteIds.push(scan._id);
            } else {
                seen.add(key);
            }
        });

        if (toDeleteIds.length > 0) {
            console.log(`Found ${toDeleteIds.length} duplicates. Deleting...`);
            await ConsumerScan.deleteMany({ _id: { $in: toDeleteIds } });
            console.log('Cleanup complete.');
        } else {
            console.log('No duplicates found.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Cleanup failed:', err);
    }
}

cleanupDuplicates();
