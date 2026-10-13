const express  = require('express');
const router   = express.Router();
const { protect, buyerOnly }                                              = require('../middleware/auth');
const { createOrder, getMyOrders, getFarmerOrders, updateOrderStatus, getOrder } = require('../controllers/orderController');

// POST   /api/orders              – buyer places order
router.post('/',            protect, buyerOnly, createOrder);

// GET    /api/orders/my           – buyer sees their orders
router.get('/my',           protect, getMyOrders);

// GET    /api/orders/farmer       – farmer sees orders for their products
router.get('/farmer',       protect, getFarmerOrders);

// PUT    /api/orders/:id/status   – farmer updates status
router.put('/:id/status',   protect, updateOrderStatus);

// GET    /api/orders/:id          – single order
router.get('/:id',          protect, getOrder);

module.exports = router;
