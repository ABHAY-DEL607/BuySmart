const { Schema, model } = require('mongoose');

const comparisonSchema = new Schema({
  comparisonData: {
    type: Array,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  comparedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Comparison', comparisonSchema);