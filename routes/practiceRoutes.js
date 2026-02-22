import express from 'express';
import { getQuestions, getBlogs } from '../controllers/practiceController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/questions', protect, getQuestions);
router.get('/blogs', protect, getBlogs);

export default router;