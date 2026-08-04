import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const migrate = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    const users = await User.find({ wheelReward: { $in: ['rs9', '20pct'] }, rewardUsed: false });
    console.log(`Found ${users.length} users with unused wheel rewards.`);
    
    let rs9Count = 0;
    let pct20Count = 0;

    for (let user of users) {
      if (user.get('wheelReward') === 'rs9') {
        user.rs9Tokens = (user.rs9Tokens || 0) + 1;
        rs9Count++;
      } else if (user.get('wheelReward') === '20pct') {
        user.pct20Tokens = (user.pct20Tokens || 0) + 1;
        pct20Count++;
      }
      
      // We don't unset them yet because Mongoose strict mode might just ignore them,
      // but the schema no longer has them so they won't be saved if strict is true.
      // We can use $unset explicitly.
      await User.collection.updateOne(
        { _id: user._id },
        { 
          $set: { rs9Tokens: user.rs9Tokens, pct20Tokens: user.pct20Tokens },
          $unset: { wheelReward: "", rewardUsed: "" }
        }
      );
    }
    
    // Unset for all others as well
    await User.collection.updateMany(
      {},
      { $unset: { wheelReward: "", rewardUsed: "" } }
    );
    
    console.log(`Migrated ${rs9Count} Rs9 tokens and ${pct20Count} 20pct tokens.`);
  } catch(e) {
    console.log(e);
  } finally {
    process.exit(0);
  }
}

migrate();
