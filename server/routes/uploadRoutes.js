import express from 'express';
import { uploadPDF, uploadScreenshot } from '../controllers/uploadController.js';
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/pdf', authMiddleware, upload.single('pdf'), uploadPDF);
router.post('/screenshot', authMiddleware, upload.single('screenshot'), uploadScreenshot);

export default router;
