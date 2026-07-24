import express from 'express';
import { signup, signin, getProfile, updateProfile, changePassword, updateAvatar, googleAuth, getAllUsers, sendOtp, resetPassword, toggleMarketingStatus, toggleCodStatus, getReferralUsers, addReferralCode } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/reset-password', resetPassword);
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/change-password', authMiddleware, changePassword);
router.put('/avatar', authMiddleware, updateAvatar);
router.post('/google', googleAuth);
router.get('/admin/all', authMiddleware, getAllUsers);
router.put('/admin/marketing/:id', authMiddleware, toggleMarketingStatus);
router.put('/admin/cod/:id', authMiddleware, toggleCodStatus);
router.get('/admin/referrals', authMiddleware, getReferralUsers);
router.post('/admin/referrals/:userId/code', authMiddleware, addReferralCode);

export default router;
