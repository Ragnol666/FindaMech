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
// 1. Dynamic CORS Configuration
const allowedOrigins = [
  'https://finda-mech-pw82.vercel.app', // Production
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isVercel = origin.endsWith('.vercel.app');
    const isAllowed = allowedOrigins.includes(origin);

    if (isVercel || isAllowed) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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