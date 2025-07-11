import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  addTransaction,
  getTransactions,
  recentTransactions,
} from '../controllers/transaction.controller';

const router = express.Router();

router.get('/', authenticate, getTransactions);
router.post('/', authenticate, addTransaction);
router.get('/recent-transactions', authenticate, recentTransactions);

export default router;
