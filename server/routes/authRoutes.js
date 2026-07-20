import express from 'express';
import { signup, signin, getProfile, changePassword, updateAvatar, googleAuth, getAllUsers } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', authMiddleware, getProfile);
router.post('/change-password', authMiddleware, changePassword);
router.put('/avatar', authMiddleware, updateAvatar);
router.post('/google', googleAuth);
router.get('/admin/all', authMiddleware, getAllUsers);

export default router;
