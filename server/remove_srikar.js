import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  // Find srikar
  const users = await User.find({ name: { $regex: /srikar/i } });
  
  if (users.length === 0) {
    console.log("Could not find a user with name srikar.");
  } else {
    for (const user of users) {
      console.log(`Found: ${user.name} (${user.email}), rs9Tokens: ${user.rs9Tokens}, pct20Tokens: ${user.pct20Tokens}`);
      
      // If he has rs9 tokens, remove them and decrement global count
      if (user.rs9Tokens && user.rs9Tokens > 0) {
        const amount = user.rs9Tokens;
        
        // Remove from user
        user.rs9Tokens = 0;
        await user.save();
        console.log(`Removed ${amount} rs9Tokens from ${user.name}`);
        
        // Decrement global count
        const Settings = (await import('./models/Settings.js')).default;
        await Settings.updateOne(
          { key: 'wheel_winners_rs9' },
          { $inc: { value: -amount } }
        );
        console.log(`Decremented global wheel_winners_rs9 by ${amount}`);
      }
    }
  }

  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
