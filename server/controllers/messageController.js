import Message from '../models/Message.js';

// GET /api/messages
// Fetch all messages for the authenticated user
export const getUserMessages = async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Newest first
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// PUT /api/messages/:id/read
// Mark a single message as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { read: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

// PUT /api/messages/read-all
// Mark all unread messages as read
export const markAllAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      { userId: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    console.error('Error marking all messages as read:', error);
    res.status(500).json({ error: 'Failed to mark all messages as read' });
  }
};
