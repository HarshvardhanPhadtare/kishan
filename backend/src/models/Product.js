const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerName:  { type: String, required: true },
  name:        { type: String, required: true, trim: true },
  category:    { type: String, enum: ['Grains', 'Fruits', 'Vegetables', 'Pulses', 'Spices', 'Dairy', 'Other'], required: true },
  description: { type: String, trim: true },
  price:       { type: Number, required: true, min: 0 },
  unit:        { type: String, enum: ['kg', 'quintal', 'dozen', 'litre', 'piece', 'bag'], default: 'kg' },
  quantity:    { type: Number, required: true, min: 1 },
  minOrder:    { type: Number, required: true, min: 1 },
  location:    { type: String, required: true },
  harvestDate: { type: Date },
  badge:       { type: String, enum: ['Organic', 'Premium', 'Fresh', 'Natural'], default: 'Fresh' },
  imageUrl:    { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  rating:      { type: Number, default: 0 },
  totalRatings:{ type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
