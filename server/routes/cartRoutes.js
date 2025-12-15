import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.put('/:itemIndex', authMiddleware, updateCartItem);
router.delete('/:itemIndex', authMiddleware, removeFromCart);
router.delete('/', authMiddleware, clearCart);

export default router;
