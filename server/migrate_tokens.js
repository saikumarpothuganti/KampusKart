import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import User from './models/User.js';

dotenv.config();

const migrate = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    const usersWithOrders = await Order.distinct('userId');
    const result = await User.updateMany(
      { _id: { $in: usersWithOrders } },
      { $set: { luckyTokens: 1 } }
    );
    console.log(`Updated ${result.modifiedCount} past users with lucky tokens.`);
  } catch(e) {
    console.log(e)
  } finally {
    process.exit(0);
  }
}
migrate();
