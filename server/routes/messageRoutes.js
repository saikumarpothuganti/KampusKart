import express from 'express';
import { getUserMessages, markAsRead, markAllAsRead } from '../controllers/messageController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all messages for the user
router.get('/', authMiddleware, getUserMessages);

// Mark all messages as read
router.put('/read-all', authMiddleware, markAllAsRead);

// Mark a specific message as read
router.put('/:id/read', authMiddleware, markAsRead);

export default router;
