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
      'mongodb+srv://gilbertgeorge_db_user:grizzle22@cluster0.vqpym0x.mongodb.net/findamech?retryWrites=true&w=majority';

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
