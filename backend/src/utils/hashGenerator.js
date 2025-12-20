const crypto = require('crypto');

/**
 * Generate a blockchain-style hash for batch creation
 * Simulates blockchain without actual network integration
 */
function generateBatchHash(batchData) {
    const dataString = JSON.stringify({
        batchId: batchData.batchId,
        farmerId: batchData.farmerId,
        crop: batchData.crop,
        quantity: batchData.quantity,
        harvestDate: batchData.harvestDate,
        timestamp: Date.now()
    });

    return crypto.createHash('sha256').update(dataString).digest('hex');
}

/**
 * Generate transaction hash with chain linking
 */
function generateTransactionHash(transactionData, previousHash = '0') {
    const dataString = JSON.stringify({
        ...transactionData,
        previousHash,
        timestamp: Date.now()
    });

    return crypto.createHash('sha256').update(dataString).digest('hex');
}

/**
 * Generate journey step hash for tracking
 */
function generateJourneyHash(journeyData) {
    const dataString = JSON.stringify({
        ...journeyData,
        timestamp: Date.now()
    });

    return crypto.createHash('sha256').update(dataString).digest('hex');
}

module.exports = {
    generateBatchHash,
    generateTransactionHash,
    generateJourneyHash
};
