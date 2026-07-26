import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kampuskart')
  .then(async () => {
    const db = mongoose.connection.db;
    const carts = await db.collection('carts').find({}).toArray();
    let updated = 0;
    
    for (const cart of carts) {
      let cartChanged = false;
      for (const item of cart.items) {
        if (item.type === 'custom' && (item.price === undefined || item.price === null || item.userPrice === 0)) {
          // Find the original PDF Request
          const pdfRequest = await db.collection('pdfrequests').findOne({ 
            userId: cart.userId, 
            status: 'priced', 
            title: item.title 
          });
          
          if (pdfRequest && pdfRequest.price) {
            item.price = pdfRequest.price;
            item.userPrice = pdfRequest.price;
            cartChanged = true;
          }
        }
      }
      
      if (cartChanged) {
        await db.collection('carts').updateOne({ _id: cart._id }, { $set: { items: cart.items } });
        updated++;
      }
    }
    
    console.log(`Updated ${updated} carts`);
    process.exit(0);
  });
