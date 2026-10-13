/**
 * Cloudinary upload helper
 * Wraps cloudinary's stream-based upload_stream API in a Promise so callers
 * can simply await the result without managing stream callbacks directly.
 */
const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer to Cloudinary under the 'kisanbazaar' folder.
 *
 * @param {Buffer} buffer  – file buffer from multer memoryStorage
 * @returns {Promise<import('cloudinary').UploadApiResponse>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'kisanbazaar' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

module.exports = { uploadToCloudinary };
