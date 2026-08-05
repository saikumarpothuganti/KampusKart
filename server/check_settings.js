import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const Settings = (await import('./models/Settings.js')).default;
  const rs9 = await Settings.findOne({ key: 'wheel_winners_rs9' });
  const pct20 = await Settings.findOne({ key: 'wheel_winners_20pct' });
  const spins = await Settings.findOne({ key: 'wheel_total_spins' });
  
  console.log(`rs9 winners: ${rs9?.value || 0}`);
  console.log(`20pct winners: ${pct20?.value || 0}`);
  console.log(`total spins: ${spins?.value || 0}`);
  
  // Optionally reset them if the user just wants them back to 0 for testing
  await Settings.updateOne({ key: 'wheel_winners_rs9' }, { value: 0 });
  await Settings.updateOne({ key: 'wheel_winners_20pct' }, { value: 0 });
  await Settings.updateOne({ key: 'wheel_total_spins' }, { value: 0 });
  console.log("Reset them to 0.");
  
  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
