import { authenticate } from '../middleware/authMiddleware';
import { addCategory, getCategories, getCategoryStats } from '../controllers/category.controller';
import express from 'express';

const router = express.Router();

// @desc    Get categories
// @route   GET /api/categories
// @access  Private
router.get('/', authenticate, getCategories);
router.get('/stats', authenticate, getCategoryStats);

// @desc    Add category
// @route   POST /api/categories
// @access  Private
router.post('/', authenticate, addCategory);

export default router;
