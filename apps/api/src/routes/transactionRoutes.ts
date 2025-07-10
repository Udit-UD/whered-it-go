import { authenticate } from '@/middleware/authMiddleware';
import express from 'express';
import { addTransaction } from '../controllers/transaction.controller';

const router = express.Router();

// @desc    Get transactions
// @route   GET /api/transactions
// @access  Private
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Transaction routes will be implemented here',
  });
});

router.post('/',  authenticate, addTransaction);

export default router;
