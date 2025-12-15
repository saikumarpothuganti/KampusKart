import mongoose from 'mongoose';

const pdfRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      default: 1,
    },
    sides: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'priced', 'added_to_cart', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const PDFRequest = mongoose.model('PDFRequest', pdfRequestSchema);
export default PDFRequest;
