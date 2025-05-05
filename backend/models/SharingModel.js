const { Schema, model } = require('mongoose');

const SharingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priceComparison: {
    type: [{
      platform: String,
      price: Number,
      url: String
    }],
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'shared'],
    default: 'public'
  },
  sharedWith: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for better query performance
SharingSchema.index({ userId: 1, createdAt: -1 });
SharingSchema.index({ visibility: 1 });

module.exports = model('Sharing', SharingSchema);