// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use a more robust connection string with explicit error handling
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds instead of the default 30
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.log('Make sure MongoDB is running and the connection URI is correct');
    // Don't immediately exit - allow for graceful fallback
    // process.exit(1);
    return false;
  }
  return true;
};

module.exports = connectDB;