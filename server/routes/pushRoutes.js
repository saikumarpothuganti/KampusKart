import express from 'express';
import { subscribe, sendTestNotification, sendCustomNotification } from '../controllers/pushController.js';

const router = express.Router();

// POST /api/push/subscribe (public endpoint for STEP 1)
router.post('/subscribe', subscribe);

// POST /api/push/test (public endpoint for STEP 2A: test notifications)
router.post('/test', sendTestNotification);

// POST /api/push/custom (admin endpoint for custom notifications)
router.post('/custom', sendCustomNotification);

export default router;
