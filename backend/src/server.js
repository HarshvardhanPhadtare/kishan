/**
 * Server entry point
 * Connects to MongoDB and starts the HTTP server.
 * Import order: dotenv → db → app → listen.
 */
require('dotenv').config();
const connectDB = require('./config/db');
const app       = require('./app');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });
