/**
 * Cloudinary configuration
 * Centralises the Cloudinary SDK initialisation so every route that needs
 * image upload / delete can import the already-configured instance.
 */
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
