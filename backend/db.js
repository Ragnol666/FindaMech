const mongoose = require('mongoose');

// Use global to persist the promise across hot-reloads in development
// and across function invocations in Vercel.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/findamech';

async function connectWithUri(uri, opts) {
  return mongoose.connect(uri, opts);
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

    const mongoCandidates = [process.env.MONGODB_URI || process.env.MONGO_URI, DEFAULT_LOCAL_URI].filter(Boolean);

    const tryConnect = async (index) => {
      const uri = mongoCandidates[index];
      if (!uri) {
        throw new Error('No MongoDB connection URI is available. Set MONGODB_URI or start a local MongoDB instance.');
      }

      try {
        return await connectWithUri(uri, opts);
      } catch (error) {
        if (index < mongoCandidates.length - 1) {
          console.warn(`MongoDB connection attempt failed for ${uri}: ${error.message}`);
          return tryConnect(index + 1);
        }

        throw error;
      }
    };

    cached.promise = tryConnect(0).then((mongooseInstance) => mongooseInstance);
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