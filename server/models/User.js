import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatarIndex: {
      type: Number,
      default: 0,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      default: 'Male',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isMarketing: {
      type: Boolean,
      default: false,
    },
    isSupplier: {
      type: Boolean,
      default: false,
    },
    codEnabled: {
      type: Boolean,
      default: false,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referralCodes: [{
      type: String,
    }],
    supplierStats: {
      totalOrders: { type: Number, default: 0 },
      singleSidedBooks: { type: Number, default: 0 },
      doubleSidedBooks: { type: Number, default: 0 },
      basicBooks: { type: Number, default: 0 },
      standardBooks: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 }
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
