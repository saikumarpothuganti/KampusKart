import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Document automatically deletes itself after 600 seconds (10 minutes)
    },
  },
  { timestamps: true }
);

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
