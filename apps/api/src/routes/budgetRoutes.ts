import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  createBudget,
  getBudget,
  copyBudget,
  allocateBudgetCategory,
  bulkAllocateBudgetCategories,
} from '../controllers/budget.controller';

const router = express.Router();

router.get('/', authenticate, getBudget);

router.post('/', authenticate, createBudget);

router.post('/copy-budget', authenticate, copyBudget);

router.post('/allocate-budget-category', authenticate, allocateBudgetCategory);

router.post('/create-budget-with-categories', authenticate, bulkAllocateBudgetCategories);

export default router;
