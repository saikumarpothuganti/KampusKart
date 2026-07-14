import express from 'express';
import {
  getCarts,
  createCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  deleteCart,
} from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, getCarts);
router.post('/create', authMiddleware, createCart);
router.post('/:cartId/add', authMiddleware, addToCart);
router.put('/:cartId/:itemIndex', authMiddleware, updateCartItem);
router.delete('/:cartId/:itemIndex', authMiddleware, removeFromCart);
router.delete('/:cartId', authMiddleware, deleteCart);

export default router;
