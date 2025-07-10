import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';
import Category from '../models/Category';
import { Response } from 'express';

// @desc    POST user category
// @route   POST /api/category/
// @access  Private
export const addCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, icon, isCommon = false } = req.body;

  if (!name || !icon) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  const existingCategory = await Category.findOne({ userId, name: name.trim(), isCommon });
  if (existingCategory) {
    return res.status(409).json({
      success: false,
      message: 'Category with this name already exists',
    });
  }

  try {
    const category = new Category({
      name: name.trim(),
      icon,
      userId,
      isCommon,
    });

    const savedCategory = await category.save();

    res.status(201).json({
      success: true,
      data: savedCategory,
      message: 'Category added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while adding category',
    });
  }
});

// @desc    GET user categories
// @route   GET /api/categories
// @access  Private
export const getCategories = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const categories = await Category.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories,
      message: 'Categories fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching categories',
    });
  }
});
