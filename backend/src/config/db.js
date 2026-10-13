/**
 * Database configuration
 * Centralises the MongoDB connection so server.js stays thin.
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
