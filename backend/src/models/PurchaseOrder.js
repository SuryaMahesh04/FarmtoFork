const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
    poNumber: {
        type: String,
        unique: true
    },
    retailerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    quantityRequested: {
        type: Number,
        required: true
    },
    priceOffered: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'fulfilled', 'cancelled'],
        default: 'pending'
    },
    notes: String,
    rejectionReason: String,
}, {
    timestamps: true
});

// Auto-increment poNumber logic (simple version)
purchaseOrderSchema.pre('save', async function(next) {
    if (!this.poNumber) {
        const count = await mongoose.model('PurchaseOrder').countDocuments();
        this.poNumber = `PO-${(count + 1).toString().padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
