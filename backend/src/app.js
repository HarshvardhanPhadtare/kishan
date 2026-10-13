/**
 * Express application
 * Sets up middleware, static serving, and API routes.
 * Kept separate from server.js so the app can be imported in tests without
 * starting the HTTP server or connecting to the database.
 */
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static assets ────────────────────────────────────────────────────────────
// Serve the frontend SPA (production convenience – same origin)
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

// Serve uploaded pesticide images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/pesticides', require('./routes/pesticides'));
app.use('/api/payments',   require('./routes/payments'));
app.use('/api/chatbot',    require('./routes/chatbot'));

// Gemini model list proxy
app.get('/api/models', async (req, res) => {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
  const d = await r.json();
  res.json(d);
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'KisanBazaar running ✅' }));

// Catch-all → frontend SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'index.html'));
});

module.exports = app;
