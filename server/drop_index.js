import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    try {
      await mongoose.connection.collection('carts').dropIndex('userId_1');
      console.log('Successfully dropped unique index userId_1');
    } catch (err) {
      if (err.code === 27) {
        console.log('Index not found, ignoring.');
      } else {
        console.error('Error dropping index:', err);
      }
    }
    process.exit(0);
  });
