const mongoose = require('mongoose');

// Use global to persist the promise across hot-reloads in development
// and across function invocations in Vercel.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      bufferCommands: false, // Recommended for serverless
    };

    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local or Vercel settings');
    }

    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on error so next request can retry
    throw e;
  }

  return cached.conn;
}

module.exports = connectToDatabase;