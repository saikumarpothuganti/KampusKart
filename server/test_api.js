import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Cart from './models/Cart.js';
import jwt from 'jsonwebtoken';

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

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, name: 'Test Cart', items: [] });
      await cart.save();
    }

    console.log('Using Cart:', cart._id);

    const item = {
      type: 'subject',
      subjectId: new mongoose.Types.ObjectId().toString(),
      title: 'Test Subject',
      code: 'TEST101',
      qty: 1,
      sides: 1,
      sideType: 'single',
      pricePerPage: 10,
      price: 10,
    };

    // Make local API request. Note: Server needs to be running.
    // Instead of HTTP, I will directly call the controller function to see if it throws.
    // Actually, I can just use a local server mock or supertest, but let's just inspect the schema again.

  } catch (err) {
    console.error('Error:', err.response?.data || err);
  } finally {
    mongoose.disconnect();
  }
}

run();
