import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    
    // Set all regular users to 1 lucky token
    const userRes = await db.collection('users').updateMany(
      { isAdmin: { $ne: true } },
      { $set: { luckyTokens: 1 } }
    );
    console.log(`Reset luckyTokens to 1 for ${userRes.modifiedCount} regular users.`);
    
    console.log('Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
