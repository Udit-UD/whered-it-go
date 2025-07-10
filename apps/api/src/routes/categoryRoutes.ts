import { authenticate } from '../middleware/authMiddleware';
import { addCategory, getCategories } from '../controllers/category.controller';
import express from 'express';

const router = express.Router();

// @desc    Get categories
// @route   GET /api/categories
// @access  Private
router.get('/', authenticate, getCategories);

// @desc    Add category
// @route   POST /api/categories
// @access  Private
router.post('/', authenticate, addCategory);

export default router;
