import 'dotenv/config';
import connectDB from './config/db.js';
import PickupPoint from './models/PickupPoint.js';

const seedPickupPoints = async () => {
  try {
    await connectDB();

    // Check if default pickup points already exist
    const existingPoints = await PickupPoint.find();
    if (existingPoints.length > 0) {
      console.log('Pickup points already exist. Skipping seed.');
      process.exit(0);
    }

    // Create default pickup point
    const defaultPoint = new PickupPoint({
      name: 'Kailash Residency (Second Gate)',
      isActive: true,
    });

    await defaultPoint.save();
    console.log('✅ Default pickup point created:', defaultPoint.name);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding pickup points:', error);
    process.exit(1);
  }
};

seedPickupPoints();
