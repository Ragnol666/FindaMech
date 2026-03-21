const express = require('express');
const cors = require('cors');
// ... other imports

const app = express();

// 1. Move CORS to the VERY TOP
app.use(cors({
  origin: true, // This allows ANY origin (including your long Vercel preview URLs)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Explicitly handle OPTIONS (Preflight) requests immediately
app.options('*', cors());

app.use(express.json());

// 3. Health check (Always works even if DB is down)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 4. DB connection middleware (AFTER CORS)
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('DB Error:', error.message);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// ... your routes