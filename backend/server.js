const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import models to ensure they are registered
require('./models/User');
require('./models/Service');
require('./models/Booking');
require('./models/Review');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const mechanicRoutes = require('./routes/mechanics');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/findamech', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  retryWrites: true,
  maxPoolSize: 10,
});

mongoose.connection.on('connected', () => {
  console.log('✓ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/mechanics', mechanicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));