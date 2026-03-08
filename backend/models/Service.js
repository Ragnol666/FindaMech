const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: String, // e.g., 'oil change', 'brake repair'
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);