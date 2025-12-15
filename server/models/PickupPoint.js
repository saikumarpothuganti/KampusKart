import mongoose from 'mongoose';

const pickupPointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const PickupPoint = mongoose.model('PickupPoint', pickupPointSchema);

export default PickupPoint;
