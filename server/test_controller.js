import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Cart from './models/Cart.js';
import { addToCart } from './controllers/cartController.js';

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

    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, name: 'Test Cart', items: [] });
      await cart.save();
    }

    const req = {
      user: { id: user._id.toString() },
      params: { cartId: cart._id.toString() },
      body: {
        type: 'subject',
        subjectId: new mongoose.Types.ObjectId().toString(),
        title: 'Test Subject',
        code: 'TEST101',
        qty: 1,
        sides: 1,
        sideType: 'single',
        pricePerPage: '', // Let's test with empty string
        price: '', // Let's test with empty string
      }
    };

    const res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        console.log(`Response ${this.statusCode}:`, data);
      }
    };

    await addToCart(req, res);

  } catch (err) {
    console.error('Unhandled Error:', err);
  } finally {
    mongoose.disconnect();
  }
}

run();
