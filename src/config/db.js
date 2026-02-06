const mongoose = require('mongoose');

/**
 * Connect to MongoDB using Mongoose
 * @throws {Error} If connection fails
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error; // Stop server startup if DB connection fails
  }
};

module.exports = connectDB;
