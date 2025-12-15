import express from 'express';
import * as pickupPointController from '../controllers/pickupPointController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Get all active pickup points (public)
router.get('/', pickupPointController.getPickupPoints);

// Get all pickup points including inactive (admin only)
router.get('/admin/all', authMiddleware, pickupPointController.getAllPickupPoints);

// Create a new pickup point (admin only)
router.post('/', authMiddleware, pickupPointController.createPickupPoint);

// Toggle pickup point active status (admin only)
router.put('/:id/toggle', authMiddleware, pickupPointController.togglePickupPoint);

// Delete a pickup point (admin only)
router.delete('/:id', authMiddleware, pickupPointController.deletePickupPoint);

export default router;
