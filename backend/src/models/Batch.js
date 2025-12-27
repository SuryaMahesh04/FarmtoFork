const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: true,
        unique: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Crop details
    crop: {
        type: String,
        required: true
    },
    variety: String,
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        default: 'kg'
    },
    harvestDate: {
        type: Date,
        required: true
    },

    // Pricing
    pricePerUnit: Number,
    totalRevenue: Number,

    // Quality
    qualityScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 85
    },
    organicCertified: {
        type: Boolean,
        default: false
    },

    // Location
    location: {
        field: String,
        village: String,
        district: String,
        state: String,
        gpsCoordinates: {
            lat: Number,
            lng: Number
        }
    },

    // QR Code Status
    qrGenerated: {
        type: Boolean,
        default: false
    },

    // Simulated Blockchain
    blockchainHash: {
        type: String,
        required: true,
        unique: true
    },
    hashTimestamp: {
        type: Date,
        default: Date.now
    },

    // Status tracking
    status: {
        type: String,
        enum: ['active', 'in-transit', 'delivered', 'completed', 'cancelled'],
        default: 'active'
    },

    // Journey tracking (supply chain movement)
    journey: [{
        stage: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        location: String,
        actorId: mongoose.Schema.Types.ObjectId,
        actorRole: String,
        details: String,
        transactionHash: String
    }],

    // Metadata
    notes: String,
    images: [String]
}, {
    timestamps: true
});

// Indexes for performance
batchSchema.index({ batchId: 1 });
batchSchema.index({ farmerId: 1 });
batchSchema.index({ status: 1 });
batchSchema.index({ harvestDate: -1 });
batchSchema.index({ createdAt: -1 });

// Virtual for formatted batch ID
batchSchema.virtual('formattedId').get(function () {
    return `BTH-${this.batchId}`;
});

// Ensure virtuals are included in JSON
batchSchema.set('toJSON', { virtuals: true });
batchSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Batch', batchSchema);
