const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String },
  quantity:    { type: Number },
  unit:        { type: String },
  price:       { type: Number },
  subtotal:    { type: Number },
});

const orderSchema = new mongoose.Schema({
  buyer:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerName:       { type: String },
  buyerCompany:    { type: String },
  items:           [orderItemSchema],
  totalAmount:     { type: Number, required: true },
  deliveryAddress: { type: String },
  notes:           { type: String },
  status:          { type: String, enum: ['pending','confirmed','shipped','delivered','cancelled'], default: 'pending' },
  // Payment
  paymentMethod:   { type: String, enum: ['razorpay','cod','pending'], default: 'pending' },
  paymentStatus:   { type: String, enum: ['pending','paid','cod','failed'], default: 'pending' },
  paymentId:       { type: String },
  razorpayOrderId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
