import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  hardDeleteOrder,
  toggleLiveLocation,
  setCustomPDFPrice,
  acceptRequest,
  updateDeliveryDays,
  markCodPaid,
  updateOrderColor,
  getSupplierOrders,
  fixSupplierPrices,
  allowEditSupplierPrices,
  updateOrderItems,
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', authMiddleware, createOrder);
router.get('/my', authMiddleware, getMyOrders);

// Move specific routes before parameterized routes
router.get('/admin/all', authMiddleware, getAllOrders);
router.get('/supplier', authMiddleware, getSupplierOrders);
router.get('/:orderId', authMiddleware, getOrderById);
router.post('/:orderId/cancel', authMiddleware, cancelOrder);
router.post('/:orderId/accept', authMiddleware, acceptRequest);

// Admin routes
router.put('/:orderId/items', authMiddleware, updateOrderItems);
router.put('/:orderId/status', authMiddleware, updateOrderStatus);
router.delete('/:orderId', authMiddleware, deleteOrder);
router.delete('/:orderId/hard', authMiddleware, hardDeleteOrder);
router.put('/:orderId/live-location', authMiddleware, toggleLiveLocation);
router.put('/:orderId/set-price', authMiddleware, setCustomPDFPrice);
router.put('/:orderId/delivery-days', authMiddleware, updateDeliveryDays);
router.put('/:orderId/mark-cod-paid', authMiddleware, markCodPaid);
router.put('/:orderId/color', authMiddleware, updateOrderColor);
router.put('/:orderId/supplier-prices', authMiddleware, fixSupplierPrices);
router.put('/:orderId/allow-edit-prices', authMiddleware, allowEditSupplierPrices);

export default router;
