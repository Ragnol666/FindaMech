const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDatabase = require('./db');

// Import models
require('./models/User');
require('./models/Service');
require('./models/Booking');
require('./models/Review');

dotenv.config();
const app = express();

// 1. Better CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://finda-mech-pw82.vercel.app', // Use your specific frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// 2. Explicitly handle Preflight (OPTIONS) requests
app.options('*', cors(corsOptions));

app.use(express.json());

// 3. Health check should be ABOVE the DB middleware 
// so you can test if the server is alive even if the DB is down
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 4. DB connection middleware
app.use(async (req, res, next) => {
  // Skip DB check for health route if you want, but fine to keep for others
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // If DB fails, we still need to send CORS headers with the error
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/mechanics', require('./routes/mechanics'));

module.exports = app;