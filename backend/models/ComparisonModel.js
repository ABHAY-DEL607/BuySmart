const { Schema, model } = require('mongoose');

const comparisonSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  platforms: {
    type: [String],
    required: true,
  },
  bestDeal: {
    type: String,
  },
  comparedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Comparison', comparisonSchema);