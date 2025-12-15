import express from 'express';
import { signup, signin, getProfile, changePassword } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', authMiddleware, getProfile);
router.post('/change-password', authMiddleware, changePassword);

export default router;
