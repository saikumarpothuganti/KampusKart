/**
 * Clear Old Local File Paths from Database
 * Run this once to clean up any orders/carts/requests with local /uploads paths
 * 
 * Usage: node clearOldData.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Import models
const CartSchema = new mongoose.Schema({}, { strict: false, collection: 'carts' });
const OrderSchema = new mongoose.Schema({}, { strict: false, collection: 'orders' });
const PDFRequestSchema = new mongoose.Schema({}, { strict: false, collection: 'pdfrequests' });

const Cart = mongoose.model('Cart', CartSchema);
const Order = mongoose.model('Order', OrderSchema);
const PDFRequest = mongoose.model('PDFRequest', PDFRequestSchema);

const clearOldData = async () => {
  await connectDB();

  console.log('\n🧹 Clearing old data with local file paths...\n');

  // Delete carts with local paths
  const cartsResult = await Cart.deleteMany({
    'items.pdfUrl': { $regex: /^\/uploads\// }
  });
  console.log(`🗑️  Deleted ${cartsResult.deletedCount} carts with local PDF paths`);

  // Delete orders with local paths
  const ordersResult = await Order.deleteMany({
    $or: [
      { 'items.pdfUrl': { $regex: /^\/uploads\// } },
      { 'payment.screenshotUrl': { $regex: /^\/uploads\// } }
    ]
  });
  console.log(`🗑️  Deleted ${ordersResult.deletedCount} orders with local file paths`);

  // Delete PDF requests with local paths
  const pdfRequestsResult = await PDFRequest.deleteMany({
    pdfUrl: { $regex: /^\/uploads\// }
  });
  console.log(`🗑️  Deleted ${pdfRequestsResult.deletedCount} PDF requests with local paths`);

  console.log('\n✅ Cleanup complete! Your database is now ready for Cloudinary URLs only.\n');
  
  process.exit(0);
};

clearOldData();
