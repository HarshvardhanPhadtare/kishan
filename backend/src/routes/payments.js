const express  = require('express');
const router   = express.Router();
const { protect }                                            = require('../middleware/auth');
const { createRazorpayOrder, verifyPayment, codPayment }     = require('../controllers/paymentController');

// POST /api/payments/create-order  – creates a Razorpay order to initiate payment
router.post('/create-order', protect, createRazorpayOrder);

// POST /api/payments/verify        – verifies payment signature after successful payment
router.post('/verify',       protect, verifyPayment);

// POST /api/payments/cod           – marks order as Cash on Delivery
router.post('/cod',          protect, codPayment);

module.exports = router;
