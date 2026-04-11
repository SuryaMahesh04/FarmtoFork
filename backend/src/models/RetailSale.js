const mongoose = require('mongoose');

const retailSaleSchema = new mongoose.Schema({
    retailerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    quantitySold: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        required: true
    },
    consumerName: {
        type: String,
        default: 'Anonymous'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RetailSale', retailSaleSchema);
