import express from 'express';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get current user's chat history
router.get('/', authMiddleware, async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user.id });
    if (!chat) {
      chat = new Chat({ user: req.user.id, messages: [] });
      await chat.save();
    }
    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// User sends a message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    let chat = await Chat.findOne({ user: req.user.id });
    if (!chat) {
      chat = new Chat({ user: req.user.id, messages: [] });
    }

    chat.messages.push({
      sender: 'user',
      text,
      isRead: false
    });

    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// User marks admin messages as read
router.put('/read', authMiddleware, async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user.id });
    if (chat) {
      let modified = false;
      chat.messages.forEach(msg => {
        if (msg.sender === 'admin' && !msg.isRead) {
          msg.isRead = true;
          modified = true;
        }
      });
      if (modified) {
        await chat.save();
      }
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Admin routes
// Get all chats
router.get('/admin', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  try {
    const chats = await Chat.find()
      .populate('user', 'name email picture _id')
      .sort({ lastUpdated: -1 });
    res.json(chats);
  } catch (error) {
    console.error('Error fetching all chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Admin sends a message to a user
router.post('/admin/:chatId', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    chat.messages.push({
      sender: 'admin',
      text,
      isRead: false
    });

    await chat.save();
    res.json(chat);
  } catch (error) {
    console.error('Error sending admin message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Admin marks user messages as read
router.put('/admin/:chatId/read', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    let modified = false;
    chat.messages.forEach(msg => {
      if (msg.sender === 'user' && !msg.isRead) {
        msg.isRead = true;
        modified = true;
      }
    });

    if (modified) {
      await chat.save();
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Admin clears a user's chat messages
router.delete('/admin/:chatId', authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    chat.messages = [];
    await chat.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing chat:', error);
    res.status(500).json({ error: 'Failed to clear chat' });
  }
});

export default router;
