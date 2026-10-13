const cloudinary             = require('../config/cloudinary');
const { uploadToCloudinary } = require('../utils/upload');
const Product                = require('../models/Product');

// GET /api/products  – list all (with filters)
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, farmer } = req.query;
    const query = { isAvailable: true };
    if (category && category !== 'All') query.category = category;
    if (farmer)   query.farmer = farmer;
    if (search)   query.name   = { $regex: search, $options: 'i' };

    let sortOpt = { createdAt: -1 };
    if (sort === 'price_asc')  sortOpt = { price: 1 };
    if (sort === 'price_desc') sortOpt = { price: -1 };
    if (sort === 'rating')     sortOpt = { rating: -1 };

    const products = await Product.find(query).sort(sortOpt);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name email phone location');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/products  – farmer creates
const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, unit, quantity, minOrder, location, harvestDate, badge } = req.body;

    let imageUrl = '', imagePublicId = '';
    if (req.file) {
      const result  = await uploadToCloudinary(req.file.buffer);
      imageUrl      = result.secure_url;
      imagePublicId = result.public_id;
    }

    const product = await Product.create({
      farmer: req.user._id, farmerName: req.user.name,
      name, category, description, price, unit, quantity, minOrder,
      location: location || req.user.location, harvestDate, badge,
      imageUrl, imagePublicId,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/products/:id – farmer updates
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    if (product.farmer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your product' });

    const fields = ['name','category','description','price','unit','quantity','minOrder','location','harvestDate','badge','isAvailable'];
    fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });

    if (req.file) {
      if (product.imagePublicId) await cloudinary.uploader.destroy(product.imagePublicId);
      const result          = await uploadToCloudinary(req.file.buffer);
      product.imageUrl      = result.secure_url;
      product.imagePublicId = result.public_id;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    if (product.farmer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your product' });
    if (product.imagePublicId) await cloudinary.uploader.destroy(product.imagePublicId);
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
