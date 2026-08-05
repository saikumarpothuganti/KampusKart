import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  const users = await User.find({}, 'name email isAdmin luckyTokens');
  console.log(`Found ${users.length} total users.`);
  
  users.forEach(u => {
    console.log(`User: ${u.email} | isAdmin: ${u.isAdmin} | luckyTokens: ${u.luckyTokens}`);
  });

  const matchingUsers = await User.find({
    isAdmin: { $ne: true },
    $or: [ { luckyTokens: 0 }, { luckyTokens: { $exists: false } }, { luckyTokens: null } ]
  });
  console.log(`Found ${matchingUsers.length} users matching query.`);

  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
