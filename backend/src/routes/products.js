const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const { protect, farmerOnly }                                    = require('../middleware/auth');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Multer – store in memory, then upload to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },
});

// GET  /api/products        – list all (with filters)
router.get('/',    getProducts);

// GET  /api/products/:id    – single product
router.get('/:id', getProduct);

// POST /api/products        – farmer creates
router.post('/',   protect, farmerOnly, upload.single('image'), createProduct);

// PUT  /api/products/:id    – farmer updates
router.put('/:id', protect, farmerOnly, upload.single('image'), updateProduct);

// DELETE /api/products/:id  – farmer deletes
router.delete('/:id', protect, farmerOnly, deleteProduct);

module.exports = router;
