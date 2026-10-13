const mongoose = require('mongoose');

const pesticideSchema = new mongoose.Schema({
  shop:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopName:    { type: String, required: true },
  shopOwner:   { type: String, required: true },
  shopPhone:   { type: String },
  address:     { type: String, required: true },
  village:     { type: String },
  district:    { type: String },
  state:       { type: String, default: 'Maharashtra' },
  coordinates: { lat: { type: Number }, lng: { type: Number } },
  name:        { type: String, required: true, trim: true },
  brand:       { type: String, trim: true },
  type:        { type: String, enum: ['Insecticide','Fungicide','Herbicide','Fertilizer','Bio-Pesticide','Other'], required: true },
  composition: { type: String },
  description: { type: String },
  usageFor:    { type: String },
  imageUrl:    { type: String, default: '' },
  price:       { type: Number, required: true, min: 0 },
  unit:        { type: String, enum: ['litre','ml','kg','gm','packet','bottle'], default: 'litre' },
  packSize:    { type: Number },
  minOrder:    { type: Number, default: 1 },
  stock:       { type: Number, default: 0 },
  licenseNo:   { type: String },
  certified:   { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  rating:      { type: Number, default: 0 },
  totalRatings:{ type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Pesticide', pesticideSchema);
