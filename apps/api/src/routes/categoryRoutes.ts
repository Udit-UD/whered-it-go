import express from 'express';

const router = express.Router();

// @desc    Get categories
// @route   GET /api/categories
// @access  Private
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Category routes will be implemented here',
  });
});

export default router;
