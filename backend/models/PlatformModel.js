const { Schema, model } = require('mongoose');

const platformSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  logoUrl: {
    type: String,
  },
  baseUrl: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = model('Platform', platformSchema);