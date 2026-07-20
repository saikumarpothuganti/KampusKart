import express from 'express';
import { getSetting, setSetting } from '../controllers/settingsController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public route to get a setting
router.get('/:key', getSetting);

// Admin route to set a setting
router.put('/:key', authMiddleware, setSetting);

export default router;
