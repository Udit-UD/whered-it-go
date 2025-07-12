import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { addTransaction, getTransactions } from '../controllers/transaction.controller';

const router = express.Router();

router.get('/', authenticate, getTransactions);
router.post('/', authenticate, addTransaction);

export default router;
