import express from 'express';
import { signup, signin, getProfile, changePassword, updateAvatar, googleAuth, getAllUsers, sendOtp, resetPassword, toggleMarketingStatus, getReferralUsers } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/reset-password', resetPassword);
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', authMiddleware, getProfile);
router.post('/change-password', authMiddleware, changePassword);
router.put('/avatar', authMiddleware, updateAvatar);
router.post('/google', googleAuth);
router.get('/admin/all', authMiddleware, getAllUsers);
router.put('/admin/marketing/:id', authMiddleware, toggleMarketingStatus);
router.get('/admin/referrals', authMiddleware, getReferralUsers);

export default router;
