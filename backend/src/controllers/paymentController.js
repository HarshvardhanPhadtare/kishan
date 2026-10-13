const crypto  = require('crypto');
const Order   = require('../models/Order');

let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  console.log('Razorpay not installed. Run: npm install razorpay');
}

// POST /api/payments/create-order
// Creates a Razorpay order to initiate payment
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100),
      currency: 'INR',
      receipt:  receipt || `receipt_${Date.now()}`,
    });

    res.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/payments/verify
// Verifies payment signature after successful payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const secret      = process.env.RAZORPAY_KEY_SECRET || 'placeholder';
    const body        = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed', success: false });
    }

    // Update order payment status if orderId provided
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        paymentId:     razorpay_payment_id,
        paymentMethod: 'razorpay',
      });
    }

    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/payments/cod
// Mark order as Cash on Delivery
const codPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Order ID required' });

    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'cod', paymentMethod: 'cod' },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment, codPayment };
