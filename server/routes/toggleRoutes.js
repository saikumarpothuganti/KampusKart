import express from 'express';
import { getOrdersEnabled, setOrdersEnabled } from '../controllers/toggleController.js';

const router = express.Router();

// Public: anyone can read order status
router.get('/orders-enabled', getOrdersEnabled);

// Admin action (handled safely inside controller)
router.post('/orders-enabled', setOrdersEnabled);

export default router;