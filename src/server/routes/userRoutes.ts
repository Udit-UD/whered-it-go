import express from 'express';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'User routes will be implemented here',
  });
});

export default router;
