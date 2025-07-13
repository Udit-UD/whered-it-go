import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  addTransaction,
  getTransactions,
  bulkCreateTransactions,
  bulkUpdateTransactions,
} from '../controllers/transaction.controller';

const router = express.Router();

router.get('/', authenticate, getTransactions);
router.post('/', authenticate, addTransaction);
router.post('/bulk-create', authenticate, bulkCreateTransactions);
router.put('/bulk-update', authenticate, bulkUpdateTransactions);

export default router;
