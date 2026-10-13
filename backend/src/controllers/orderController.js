const Order   = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders  – buyer places order
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, notes } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No items in order' });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (item.quantity < product.minOrder)
        return res.status(400).json({ message: `Minimum order for ${product.name} is ${product.minOrder} ${product.unit}` });

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      orderItems.push({
        product: product._id, productName: product.name,
        farmerName: product.farmerName, imageUrl: product.imageUrl,
        price: product.price, unit: product.unit,
        quantity: item.quantity, subtotal,
      });
    }

    const order = await Order.create({
      buyer: req.user._id, buyerName: req.user.name,
      buyerCompany: req.user.company,
      items: orderItems, totalAmount, deliveryAddress, notes,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/my  – buyer sees their orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/farmer  – farmer sees orders for their products
const getFarmerOrders = async (req, res) => {
  try {
    const myProducts = await Product.find({ farmer: req.user._id }).select('_id');
    const ids        = myProducts.map(p => p._id);
    const orders     = await Order.find({ 'items.product': { $in: ids } }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/orders/:id/status  – farmer updates status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getFarmerOrders, updateOrderStatus, getOrder };
