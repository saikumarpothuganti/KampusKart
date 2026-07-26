import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kampuskart')
  .then(async () => {
    const db = mongoose.connection.db;
    const carts = await db.collection('carts').find({}).toArray();
    for (const cart of carts) {
      if (cart.items && cart.items.length >= 10) {
        console.log(`Cart ID: ${cart._id}`);
        cart.items.forEach(item => {
          console.log(`- ${item.title}: price=${item.price} (${typeof item.price}), userPrice=${item.userPrice} (${typeof item.userPrice}), qty=${item.qty}`);
        });
        const subtotal = cart.items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 1)), 0);
        console.log(`calculated subtotal: ${subtotal}`);
      }
    }
    process.exit(0);
  });
