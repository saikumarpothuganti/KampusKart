import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from './models/Subject.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  // Update all subjects to have basicStock: 5
  const result = await Subject.updateMany(
    {},
    { $set: { basicStock: 5 } }
  );

  console.log(`Updated ${result.modifiedCount} existing subjects to have 5 basicStock.`);
  
  mongoose.disconnect();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
