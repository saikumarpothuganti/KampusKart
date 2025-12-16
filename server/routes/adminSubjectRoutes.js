import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { adminUpdateSubject } from '../controllers/subjectController.js';

const router = express.Router();

router.patch('/:id', authMiddleware, adminUpdateSubject);

export default router;
