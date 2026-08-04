import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // 1. Update fields in Subjects collection
    const subjectsRes = await db.collection('subjects').updateMany(
      {},
      {
        $rename: {
          'rapid_singleSidePrice': 'flash_singleSidePrice',
          'rapid_doubleSidePrice': 'flash_doubleSidePrice'
        }
      }
    );
    console.log(`Updated ${subjectsRes.modifiedCount} subjects`);
    
    // 2. Update quality in Orders collection
    const ordersRes = await db.collection('orders').find({ 'items.quality': 'rapid' }).toArray();
    let orderUpdates = 0;
    
    for (const order of ordersRes) {
      let changed = false;
      order.items.forEach(item => {
        if (item.quality === 'rapid') {
          item.quality = 'flash';
          changed = true;
        }
      });
      if (changed) {
        await db.collection('orders').updateOne({ _id: order._id }, { $set: { items: order.items } });
        orderUpdates++;
      }
    }
    console.log(`Updated ${orderUpdates} orders`);

    // 3. Update quality in PDFRequests collection
    const pdfRes = await db.collection('pdfrequests').find({ 'quality': 'rapid' }).toArray();
    let pdfUpdates = 0;
    
    for (const req of pdfRes) {
      await db.collection('pdfrequests').updateOne({ _id: req._id }, { $set: { quality: 'flash' } });
      pdfUpdates++;
    }
    console.log(`Updated ${pdfUpdates} PDF requests`);
    
    console.log('Migration complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
