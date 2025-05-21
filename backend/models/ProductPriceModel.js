const { Schema, model } = require('mongoose');

const productPriceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
    // index: true
  },
  productName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  currentSite: {
    type: String,
    required: true,
    trim: true
  },
  currentPrice: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    trim: true
  },
  productUrl: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  isTracking: {
    type: Boolean,
    default: false
  },
  priceHistory: [{
    price: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

// Create compound index for better query performance
productPriceSchema.index({ userId: 1, productName: 1, currentSite: 1 });

module.exports = model('ProductPrice', productPriceSchema);