import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from './models/Subject.js';
import Order from './models/Order.js';

dotenv.config();

const migrate = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // 1. Rename fields in Subject collection
    console.log('Migrating Subject collection...');
    const subjectResult = await Subject.updateMany(
      {},
      { 
        $rename: { 
          'premium_singleSidePrice': 'rapid_singleSidePrice',
          'premium_doubleSidePrice': 'rapid_doubleSidePrice'
        } 
      }
    );
    console.log(`Subject migration result: ${JSON.stringify(subjectResult)}`);

    // 2. Update 'premium' to 'rapid' in Order collection
    console.log('Migrating Order collection...');
    const orders = await Order.find({ 'items.quality': 'premium' });
    let updatedOrders = 0;
    for (const order of orders) {
      let changed = false;
      for (const item of order.items) {
        if (item.quality === 'premium') {
          item.quality = 'rapid';
          changed = true;
        }
      }
      if (changed) {
        await order.save();
        updatedOrders++;
      }
    }
    console.log(`Successfully migrated ${updatedOrders} orders.`);

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};

migrate();
