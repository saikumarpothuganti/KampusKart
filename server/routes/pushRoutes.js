import express from 'express';
import { subscribe } from '../controllers/pushController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/push/subscribe
router.post('/subscribe', authMiddleware, subscribe);

export default router;
