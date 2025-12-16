import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  toggleLiveLocation,
  setCustomPDFPrice,
  acceptRequest,
  updateDeliveryDays,
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);
router.get('/:orderId', authMiddleware, getOrderById);
router.post('/:orderId/cancel', authMiddleware, cancelOrder);
router.post('/:orderId/accept', authMiddleware, acceptRequest);

// Admin routes
router.get('/admin/all', authMiddleware, getAllOrders);
router.put('/:orderId/status', authMiddleware, updateOrderStatus);
router.delete('/:orderId', authMiddleware, deleteOrder);
router.put('/:orderId/live-location', authMiddleware, toggleLiveLocation);
router.put('/:orderId/set-price', authMiddleware, setCustomPDFPrice);
router.put('/:orderId/delivery-days', authMiddleware, updateDeliveryDays);

export default router;
