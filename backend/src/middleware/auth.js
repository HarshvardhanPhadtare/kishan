const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const farmerOnly = (req, res, next) => {
  if (req.user?.role !== 'farmer') return res.status(403).json({ message: 'Farmers only' });
  next();
};

const buyerOnly = (req, res, next) => {
  if (req.user?.role !== 'buyer') return res.status(403).json({ message: 'Buyers only' });
  next();
};

module.exports = { protect, farmerOnly, buyerOnly };
