const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role:     { type: String, enum: ['farmer', 'buyer', 'shopowner'], required: true },
  phone:    { type: String, trim: true },
  location: { type: String, trim: true },
  farmName:    { type: String },
  company:     { type: String },
  shopName:    { type: String },
  licenseNo:   { type: String },
  shopAddress: { type: String },
  coordinates: { lat: { type: Number }, lng: { type: Number } },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
