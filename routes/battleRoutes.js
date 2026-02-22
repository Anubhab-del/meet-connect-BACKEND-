import express from 'express';
import {
  createBattle,
  getOpenBattles,
  joinBattle,
  submitAnswer,
  getMyBattles,
  getLeaderboard,
  getBattle,
} from '../controllers/battleController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createBattle);
router.get('/open', protect, getOpenBattles);
router.get('/my', protect, getMyBattles);
router.get('/leaderboard', protect, getLeaderboard);
router.get('/:id', protect, getBattle);
router.post('/join/:id', protect, joinBattle);
router.post('/submit/:id', protect, submitAnswer);

export default router;