import express from 'express';
import {
  getSubjectsByYearSem,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from '../controllers/subjectController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSubjectsByYearSem);
router.get('/all', getAllSubjects);
router.post('/', authMiddleware, createSubject);
router.put('/:id', authMiddleware, updateSubject);
router.delete('/:id', authMiddleware, deleteSubject);

export default router;
