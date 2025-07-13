import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  addTransaction,
  getTransactions,
  bulkCreateTransactions,
  bulkUpdateTransactions,
  deleteTransaction,
} from '../controllers/transaction.controller';

const router = express.Router();

router.get('/', authenticate, getTransactions);
router.post('/', authenticate, addTransaction);
router.post('/bulk-create', authenticate, bulkCreateTransactions);
router.put('/bulk-update', authenticate, bulkUpdateTransactions);
router.delete('/:id', authenticate, deleteTransaction);

export default router;
