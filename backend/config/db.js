const mongoose = require('mongoose');

// Pre-load models so mongoose knows about them
require('../models/User');
require('../models/Complaint');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️  MONGO_URI not set — running in local file mode');
    return false;
  }

  const options = {
    serverSelectionTimeoutMS: 8000,
    socketTimeoutMS: 30000,
  };

  let attempt = 0;
  const maxAttempts = 3;

  while (attempt < maxAttempts) {
    attempt++;
    try {
      const conn = await mongoose.connect(uri, options);
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      const remaining = maxAttempts - attempt;
      console.warn(`⚠️  MongoDB attempt ${attempt}/${maxAttempts} failed: ${error.message}`);
      if (remaining > 0) {
        const wait = attempt * 2000;
        console.log(`   Retrying in ${wait / 1000}s...`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }

  console.warn('📁 MongoDB unavailable — switching to LOCAL FILE STORAGE (backend/data/)');
  console.warn('   Data will be saved locally and synced to Atlas when connection is restored.');
  console.warn('   To fix: whitelist your IP in MongoDB Atlas → Network Access tab.');
  return false;
};

module.exports = connectDB;
