import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  const srikar = await User.findOne({ email: 'srikarkorada284@gmail.com' });
  console.log(`Srikar rs9Tokens: ${srikar?.rs9Tokens}`);
  
  const Settings = (await import('./models/Settings.js')).default;
  const rs9 = await Settings.findOne({ key: 'wheel_winners_rs9' });
  console.log(`Global rs9 winners count: ${rs9?.value}`);
  
  const winners = await User.find({
    isAdmin: false,
    $or: [{ rs9Tokens: { $gt: 0 } }, { pct20Tokens: { $gt: 0 } }]
  }).select("name email rs9Tokens pct20Tokens");
  
  console.log("Current Winners List:");
  winners.forEach(w => console.log(`- ${w.name} (${w.email}): rs9=${w.rs9Tokens}, pct20=${w.pct20Tokens}`));

  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
