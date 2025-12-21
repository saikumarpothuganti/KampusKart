import mongoose from 'mongoose';

const pushSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    subscription: {
      endpoint: {
        type: String,
        required: true,
        unique: true,
      },
      keys: {
        p256dh: String,
        auth: String,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const PushSubscription = mongoose.model('PushSubscription', pushSubscriptionSchema);
export default PushSubscription;
