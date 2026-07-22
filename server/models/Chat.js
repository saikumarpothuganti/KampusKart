import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  messages: [messageSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update the lastUpdated field whenever a message is added
chatSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
