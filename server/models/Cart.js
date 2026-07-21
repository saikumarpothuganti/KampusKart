import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      default: 'My Cart',
    },
    items: [
      {
        type: {
          type: String,
          enum: ['subject', 'custom'],
          required: true,
        },
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',
        },
        title: String,
        code: String,
        pdfUrl: String,
        qty: Number,
        sides: Number,
        sideType: {
          type: String,
          enum: ['single', 'double'],
        },
        quality: {
          type: String,
          enum: ['basic', 'standard', 'premium'],
          default: 'standard',
        },
        pricePerPage: Number,
        price: Number,
        userPrice: Number,
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
