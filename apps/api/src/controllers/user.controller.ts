import type { AuthenticatedRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { Response } from 'express';
import { findTopCategory } from './utils';
import _ from 'lodash';
import Category from '../models/Category';

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
    return;
  }

  const { imageUrl, monthlyBudget } = req.body;

  // Validate input
  if (!imageUrl && !monthlyBudget) {
    res.status(400).json({
      success: false,
      message: 'No data provided to update',
    });
    return;
  }

  // Update user profile
  const user = await User.findByIdAndUpdate(
    userId,
    imageUrl ? { profilePicture: imageUrl } : { monthlyBudget },
    { new: true, runValidators: true }
  );

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        updatedAt: user.updatedAt,
        monthlyBudget: user.monthlyBudget,
      },
    },
  });
});

// @desc    Get user profile
// @route   GET /api/users/
// @access  Private
export const getUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
    return;
  }

  // Update user profile
  const user = await User.findById(userId).select('-password -__v');

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  res.json({
    success: true,
    data: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      updatedAt: user.updatedAt,
      profilePicture: user.profilePicture,
      monthlyBudget: user.monthlyBudget,
    },
  });
});

export const getBudgetOverview = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const user = await User.findById(userId).select('monthlyBudget');
    const transactions = await Transaction.find({
      userId,
      date: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    });

    const monthlySpent = _.reduce(transactions, (sum, transaction) => sum + transaction.amount, 0);
    const budget = user?.monthlyBudget || 0;
    const remainingBudget = budget - monthlySpent;
    const spentPercentage = budget > 0 ? (monthlySpent / budget) * 100 : 0;
    const totalTransactions = transactions.length;
    const avgDailySpending = totalTransactions > 0 ? monthlySpent / totalTransactions : 0;
    const topCategory = findTopCategory(transactions);
    let category = null;

    if (topCategory) {
      category = await Category.findById(topCategory).select('name icon');
    }

    const monthlyChange = transactions.length ? ((monthlySpent - budget) / budget) * 100 : 0;

    // calculate these props
    //     const quickStats = {
    //   totalTransactions: 47,
    //   avgDailySpending: 616,
    //   topCategory: 'Food',
    //   monthlyChange: 12.5,
    // };

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        monthlyBudget: budget,
        monthlySpent,
        remainingBudget,
        spentPercentage,
        totalTransactions,
        avgDailySpending,
        topCategory: category,
        monthlyChange,
      },
      message: 'Budget overview retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
    return;
  }
});
