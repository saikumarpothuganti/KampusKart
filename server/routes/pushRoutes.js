import express from 'express';
import { subscribe } from '../controllers/pushController.js';

const router = express.Router();

// POST /api/push/subscribe (public endpoint for STEP 1)
router.post('/subscribe', subscribe);

export default router;
