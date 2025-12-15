import express from 'express';
import {
  createPDFRequest,
  getMyPDFRequests,
  getAllPDFRequests,
  setPDFRequestPrice,
  cancelPDFRequest,
  markAsAddedToCart,
} from '../controllers/pdfRequestController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', authMiddleware, createPDFRequest);
router.get('/my', authMiddleware, getMyPDFRequests);
router.post('/:requestId/cancel', authMiddleware, cancelPDFRequest);
router.post('/:requestId/add-to-cart', authMiddleware, markAsAddedToCart);

// Admin routes
router.get('/admin/all', authMiddleware, getAllPDFRequests);
router.put('/:requestId/set-price', authMiddleware, setPDFRequestPrice);

export default router;
