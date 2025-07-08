import express from 'express';

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

export default router;
