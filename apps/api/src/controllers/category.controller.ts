import Transaction from '../models/Transaction';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';
import Category from '../models/Category';
import { Response } from 'express';
import User from '../models/User';
import mongoose from 'mongoose';

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
    const categories = await Category.aggregate([
      {
        $match: {
          $or: [{ userId: new mongoose.Types.ObjectId(userId) }, { isCommon: true }],
        },
      },
    ]);

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

export const getCategoryStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const userMonthlyBudget = await User.findById(userId).select('monthlyBudget');

    const categories = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          categoryId: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$categoryId',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          categoryObjectId: { $toObjectId: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryObjectId',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $project: {
          _id: 0,
          categoryId: '$categoryDetails._id',
          totalAmount: 1,
          count: 1,
          categoryName: '$categoryDetails.name',
          categoryIcon: '$categoryDetails.icon',
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    const budgetPercentageSpentOnEachCategory = categories.map(category => {
      const budgetPercentage = userMonthlyBudget?.monthlyBudget
        ? ((category.totalAmount / userMonthlyBudget.monthlyBudget) * 100).toFixed(2)
        : 0;
      return {
        ...category,
        budgetPercentage,
      };
    });

    console.log('Budget Percentage Spent on Each Category:', budgetPercentageSpentOnEachCategory);

    res.status(200).json({
      success: true,
      data: budgetPercentageSpentOnEachCategory,
      message: 'Category stats fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching category stats',
    });
  }
});
