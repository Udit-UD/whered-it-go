import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { updateProfile, getUserProfile, getBudgetOverview } from '../controllers/user.controller';

const router = express.Router();

router.get('/', authenticate, getUserProfile);
router.patch('/', authenticate, updateProfile);
router.get('/budget-overview', authenticate, getBudgetOverview);

export default router;
