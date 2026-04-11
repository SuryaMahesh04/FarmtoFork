const mongoose = require('mongoose');

const consumerScanSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    isTampered: {
        type: Boolean,
        default: false
    },
    location: {
        district: String,
        state: String
    },
    scannedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Prevent duplicate scans within a very short timeframe if needed?
// Just let them scan the same batch multiple times if they want, but could index.
// consumerScanSchema.index({ deviceId: 1, batchId: 1 }, { unique: true }); // We might want them to be able to re-scan.

module.exports = mongoose.model('ConsumerScan', consumerScanSchema);
