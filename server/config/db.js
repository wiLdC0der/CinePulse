const mongoose = require('mongoose');
const { mongodbUri } = require('./env');

async function connectDB() {
  try {
    await mongoose.connect(mongodbUri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    // There is no useful degraded mode without a database, so exit.
    process.exit(1);
  }
}

module.exports = connectDB;
