import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetTokens = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Set all regular users to 0 lucky tokens
    const userRes = await User.updateMany(
      { isAdmin: { $ne: true } },
      { $set: { luckyTokens: 0 } }
    );
    console.log(`Reset luckyTokens to 0 for ${userRes.modifiedCount} regular users.`);

    // Set all admins to 999,999 lucky tokens
    const adminRes = await User.updateMany(
      { isAdmin: true },
      { $set: { luckyTokens: 999999 } }
    );
    console.log(`Gave 999,999 luckyTokens to ${adminRes.modifiedCount} admins.`);

  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

resetTokens();
