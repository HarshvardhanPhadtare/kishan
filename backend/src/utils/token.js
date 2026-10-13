/**
 * JWT utility
 * Provides a single, reusable token-generation helper used by authentication
 * routes.
 */
const jwt = require('jsonwebtoken');

/**
 * Signs a JWT that identifies a user by their Mongoose ObjectId.
 * @param {string|import('mongoose').Types.ObjectId} id  – user _id
 * @returns {string} signed JWT valid for 7 days
 */
const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

module.exports = { genToken };
