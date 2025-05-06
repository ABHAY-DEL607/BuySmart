const { Schema, model } = require('mongoose');

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['price_alert', 'product_update', 'system'],
    default: 'system'
  },
  read: {
    type: Boolean,
    default: false
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  }
}, {
  timestamps: true
});

module.exports = model('Notification', NotificationSchema);