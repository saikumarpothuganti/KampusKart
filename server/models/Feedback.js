import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    default: '',
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  feedback: {
    type: String,
    required: [true, 'Feedback text is required'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Feedback', feedbackSchema);
