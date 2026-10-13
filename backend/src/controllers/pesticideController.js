const Pesticide         = require('../models/Pesticide');
const { haversine }     = require('../utils/geo');

// GET /api/pesticides  – list with optional filters and geo sort
const getPesticides = async (req, res) => {
  try {
    const { type, district, search, sortBy, lat, lng, radius } = req.query;
    const filter = { isAvailable: true };
    if (type && type !== 'All') filter.type = type;
    if (district) filter.district = new RegExp(district, 'i');
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') }, { brand: new RegExp(search, 'i') },
      { usageFor: new RegExp(search, 'i') }, { shopName: new RegExp(search, 'i') },
    ];

    let docs = await Pesticide.find(filter).lean();

    if (lat && lng) {
      const uLat = parseFloat(lat), uLng = parseFloat(lng), rad = parseFloat(radius) || 100;
      docs = docs
        .map(d => {
          d._distance = (d.coordinates?.lat && d.coordinates?.lng)
            ? haversine(uLat, uLng, d.coordinates.lat, d.coordinates.lng)
            : 9999;
          return d;
        })
        .filter(d => d._distance <= rad)
        .sort((a, b) => a._distance - b._distance);
    } else {
      if (sortBy === 'price_asc')       docs.sort((a, b) => a.price - b.price);
      else if (sortBy === 'price_desc') docs.sort((a, b) => b.price - a.price);
      else                              docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(docs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/pesticides/shops  – aggregated shop list
const getShops = async (req, res) => {
  try {
    const shops = await Pesticide.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id:         '$shop',
          shopName:    { $first: '$shopName' },
          shopOwner:   { $first: '$shopOwner' },
          shopPhone:   { $first: '$shopPhone' },
          address:     { $first: '$address' },
          village:     { $first: '$village' },
          district:    { $first: '$district' },
          coordinates: { $first: '$coordinates' },
          totalItems:  { $sum: 1 },
          minPrice:    { $min: '$price' },
        },
      },
    ]);
    res.json(shops);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/pesticides/:id
const getPesticide = async (req, res) => {
  try {
    const doc = await Pesticide.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// POST /api/pesticides  – shop owner adds a listing
const createPesticide = async (req, res) => {
  try {
    if (req.user.role !== 'shopowner')
      return res.status(403).json({ message: 'Only shop owners can list pesticides' });

    const {
      name, brand, type, composition, description, usageFor, price, unit,
      packSize, minOrder, stock, address, village, district, state, lat, lng, licenseNo, certified,
    } = req.body;

    if (!name || !type || !price || !address)
      return res.status(400).json({ message: 'Name, type, price and address are required' });

    const doc = await Pesticide.create({
      shop:      req.user._id,
      shopName:  req.user.shopName || req.user.name,
      shopOwner: req.user.name,
      shopPhone: req.user.phone,
      name, brand, type, composition, description, usageFor,
      price:    Number(price),
      unit,
      packSize: packSize  ? Number(packSize)  : undefined,
      minOrder: minOrder  ? Number(minOrder)  : 1,
      stock:    stock     ? Number(stock)     : 0,
      address, village, district,
      state:       state || 'Maharashtra',
      coordinates: (lat && lng) ? { lat: parseFloat(lat), lng: parseFloat(lng) } : {},
      licenseNo,
      certified:   certified === 'true',
      imageUrl:    req.file ? `/uploads/pesticides/${req.file.filename}` : '',
    });

    res.status(201).json(doc);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/pesticides/:id
const deletePesticide = async (req, res) => {
  try {
    const doc = await Pesticide.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    if (doc.shop.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await doc.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getPesticides, getShops, getPesticide, createPesticide, deletePesticide };
