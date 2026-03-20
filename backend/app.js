const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDatabase = require('./db');

// Import models
require('./models/User');
require('./models/Service');
require('./models/Booking');
require('./models/Review');

const express = require('express');
const cors = require('cors');
// ... other imports

const app = express();

// 1. Move CORS to the VERY TOP (Before EVERYTHING else)
app.use(cors({
  origin: true, // This tells the server to accept ANY origin that calls it
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Explicitly handle OPTIONS requests immediately
app.options('*', cors());

app.use(express.json());

// 3. Health check (No DB check here)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 4. Wrap your DB connection so it doesn't block the headers
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('DB Error:', error.message);
    // Even on error, CORS headers are already set by the middleware above
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// ... rest of your routes

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/mechanics', require('./routes/mechanics'));

module.exports = app;