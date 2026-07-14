const dotenv = require('dotenv');
const app = require('./app');
const connectToDatabase = require('./db');

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

connectToDatabase()
  .then(() => {
    console.log('MongoDB connected successfully');
    startServer();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    console.warn('Starting server without a database connection. Configure a valid MongoDB URI to enable data operations.');
    startServer();
  });
