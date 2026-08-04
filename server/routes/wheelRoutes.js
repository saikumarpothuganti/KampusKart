import express from 'express';
import { spinWheel, getWinners } from '../controllers/wheelController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/spin', auth, spinWheel);
router.get('/winners', getWinners);

export default router;
