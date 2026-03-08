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

    cachedConnectionPromise = mongoose.connect(mongoUri, {
      maxPoolSize: 10,
    });
  }

  await cachedConnectionPromise;
  return mongoose.connection;
}

module.exports = connectToDatabase;
