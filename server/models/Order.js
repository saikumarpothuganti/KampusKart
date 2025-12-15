import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    items: [
      {
        type: {
          type: String,
          enum: ['subject', 'custom'],
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
        price: Number,
        userPrice: Number,
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending_price', 'sent', 'placed', 'printing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'sent',
    },
    canCancel: {
      type: Boolean,
      default: true,
    },
    payment: {
      screenshotUrl: String,
    },
    pickupAddress: {
      type: String,
      default: 'KL University, Vaddeswaram',
    },
    pickupPoint: {
      type: String,
      required: true,
    },
    student: {
      name: String,
      collegeId: String,
      phone: String,
    },
    notes: String,
    liveLocationEnabled: {
      type: Boolean,
      default: false,
    },
    deliveryLocation: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    priceSetByAdmin: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
