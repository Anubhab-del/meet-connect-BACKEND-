import express from 'express';
import {
  scheduleInterview,
  getUpcomingInterviews,
  getCompletedInterviews,
  updateInterview,
  deleteInterview,
} from '../controllers/interviewController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, scheduleInterview);
router.get('/upcoming', protect, getUpcomingInterviews);
router.get('/completed', protect, getCompletedInterviews);
router.put('/:id', protect, updateInterview);
router.delete('/:id', protect, deleteInterview);

export default router;