import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  // Find all non-admin users with 0 or null luckyTokens
  const result = await User.updateMany(
    { 
      isAdmin: { $ne: true },
      $or: [ { luckyTokens: 0 }, { luckyTokens: { $exists: false } }, { luckyTokens: null } ]
    },
    { $set: { luckyTokens: 1 } }
  );

  console.log(`Updated ${result.modifiedCount} existing users to have 1 Lucky Token.`);
  
  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
