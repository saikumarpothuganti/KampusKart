import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cart from './models/Cart.js';
import User from './models/User.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  try {
    const user = await User.findOne();
    if (!user) {
      console.log('No user found');
      return;
    }
    console.log('User:', user._id);

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, name: 'Test Cart', items: [] });
      await cart.save();
    }
    console.log('Cart:', cart._id);

    cart.items.push({
      type: 'subject',
      subjectId: new mongoose.Types.ObjectId(),
      title: 'Test Subject',
      code: 'TEST101',
      qty: 1,
      sides: 1,
      sideType: 'single',
      pricePerPage: 10,
      price: 10,
    });

    await cart.save();
    console.log('Item added successfully');
  } catch (err) {
    console.error('Error adding item:', err);
  } finally {
    mongoose.disconnect();
  }
}

run();
