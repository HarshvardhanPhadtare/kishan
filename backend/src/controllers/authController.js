const User         = require('../models/User');
const { genToken } = require('../utils/token');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const {
      name, email, password, role, phone, location,
      farmName, company, shopName, licenseNo, shopAddress, lat, lng,
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const userData = { name, email, password, role, phone, location, farmName, company, shopName, licenseNo, shopAddress };
    if (lat && lng) userData.coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };

    const user = await User.create(userData);
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, token: genToken(user._id),
      shopName: user.shopName, licenseNo: user.licenseNo, location: user.location,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, location: user.location, farmName: user.farmName,
      company: user.company, shopName: user.shopName, licenseNo: user.licenseNo,
      coordinates: user.coordinates, token: genToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
