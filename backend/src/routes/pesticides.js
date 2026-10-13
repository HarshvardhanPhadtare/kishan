const express  = require('express');
const router   = express.Router();
const path     = require('path');
const fs       = require('fs');
const multer   = require('multer');
const { protect }                                                                = require('../middleware/auth');
const { getPesticides, getShops, getPesticide, createPesticide, deletePesticide } = require('../controllers/pesticideController');

// Disk storage for pesticide images (served at /uploads/pesticides)
const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'pesticides');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename:    (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// GET    /api/pesticides         – list with optional filters and geo sort
router.get('/',       getPesticides);

// GET    /api/pesticides/shops   – aggregated shop list
router.get('/shops',  getShops);

// GET    /api/pesticides/:id     – single pesticide
router.get('/:id',    getPesticide);

// POST   /api/pesticides         – shop owner adds a listing
router.post('/',      protect, upload.single('image'), createPesticide);

// DELETE /api/pesticides/:id     – shop owner removes a listing
router.delete('/:id', protect, deletePesticide);

module.exports = router;
