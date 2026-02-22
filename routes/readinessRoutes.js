import express from 'express';
import { getReadinessScore } from '../controllers/readinessController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getReadinessScore);

export default router;