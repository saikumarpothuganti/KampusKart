import mongoose from 'mongoose';

const deletedOrderSchema = new mongoose.Schema(
  {
    orderId: String,
    referralCode: String,
    amount: Number,
    createdAt: Date,
    deletedAt: {
      type: Date,
      default: Date.now
    }
  },
  { strict: false } // Allows saving the entire original order object flexibly
);

const DeletedOrder = mongoose.model('DeletedOrder', deletedOrderSchema);

export default DeletedOrder;
