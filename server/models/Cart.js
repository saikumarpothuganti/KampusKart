import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
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
