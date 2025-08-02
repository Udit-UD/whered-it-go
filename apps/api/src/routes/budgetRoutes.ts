import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  createBudget,
  getBudget,
  copyBudget,
  allocateBudgetCategory,
} from '../controllers/budget.controller';

const router = express.Router();

router.get('/', authenticate, getBudget);

router.post('/', authenticate, createBudget);

router.post('/copy-budget', authenticate, copyBudget);

router.post('/allocate-budget-category', authenticate, allocateBudgetCategory);

export default router;
