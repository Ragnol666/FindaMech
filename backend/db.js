const mongoose = require('mongoose');

let cachedConnectionPromise;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedConnectionPromise) {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      'mongodb://localhost:27017/findamech';

    if (!mongoUri) {
      throw new Error('Missing MongoDB connection string (MONGO_URI)');
    }

    cachedConnectionPromise = mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      tls: true,
      family: 4,
    });
  }

  try {
    await cachedConnectionPromise;
  } catch (error) {
    // Allow subsequent requests to retry a fresh connection.
    cachedConnectionPromise = undefined;
    throw error;
  }

  return mongoose.connection;
}

module.exports = connectToDatabase;
