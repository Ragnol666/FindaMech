const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDatabase = require('./db');

// Import models to ensure they are registered
require('./models/User');
require('./models/Service');
require('./models/Booking');
require('./models/Review');

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  })
);
app.use(express.json());

// Ensure DB connection before handling API requests.
app.use(async (_req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    res.status(500).send({ message: 'Database connection failed' });
  }
});

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const mechanicRoutes = require('./routes/mechanics');

app.get('/api/health', (_req, res) => {
  res.send({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/mechanics', mechanicRoutes);

module.exports = app;
