import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import User from './models/User.js';
import Subject from './models/Subject.js';
import PDFRequest from './models/PDFRequest.js';

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: 'ganeshvanamala16@gmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }
    
    const orders = await Order.find({ user: user._id })
      .populate('items.subject')
      .sort({ createdAt: -1 });
      
    const allOrders = await Order.find().populate('userId');
    const allPdfReqs = await PDFRequest.find().populate('userId');
    
    const orders24 = allOrders.filter(o => {
      const dateIST = new Date(o.createdAt.getTime() + (5.5 * 60 * 60 * 1000));
      return dateIST.getUTCDate() === 24;
    });
    
    const pdf24 = allPdfReqs.filter(o => {
      const dateIST = new Date(o.createdAt.getTime() + (5.5 * 60 * 60 * 1000));
      return dateIST.getUTCDate() === 24;
    });

    console.log(`\n--- ALL ORDERS ON THE 24TH (${orders24.length}) ---`);
    orders24.forEach(o => {
      const email = o.user ? o.user.email : 'Unknown User';
      console.log(`Order ${o.orderId || o._id} by ${email}`);
    });

    console.log(`\n--- ALL PDF REQUESTS ON THE 24TH (${pdf24.length}) ---`);
    pdf24.forEach(o => {
      const email = o.userId ? o.userId.email : 'Unknown User';
      console.log(`Request ${o.requestId} by ${email}`);
    });
    
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
