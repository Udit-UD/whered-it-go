import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';
import { Response } from 'express';
import Transaction from '../models/Transaction';
import User from '../models/User';
import _ from 'lodash';

// @desc    POST user transaction
// @route   POST /api/transaction/
// @access  Private
export const addTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { amount, description, categoryId, date, transactionType } = req.body;

  if (!amount || !description || !categoryId || !date || !transactionType) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  try {
    const transaction = new Transaction({
      amount,
      description,
      categoryId,
      date: new Date(date),
      userId,
      transactionType,
    });

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (!user.monthlyBudget) throw new Error('User monthly budget not set');

    user.monthlyBudget = user.monthlyBudget - amount;

    const savedTransaction = await transaction.save();
    await user.save();

    res.status(201).json({
      success: true,
      data: savedTransaction,
      message: 'Transaction added successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while adding transaction',
    });
  }
});

// @desc    GET user transaction
// @route   GET /api/transaction/
// @access  Private
export const getTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      data: transactions,
      message: 'Transactions retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while retrieving transactions',
    });
  }
});

export const recentTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const limit = parseInt(req.query.limit as string) || 20;
  const page = parseInt(req.query.page as string) || 1;

  try {
    const transactions = await Transaction.find({ userId })
      .populate('categoryId')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    if (!transactions.length) {
      return res.status(200).json({
        success: false,
        data: [],
        message: 'No transactions found',
      });
    }

    const updatedTransactions = _.map(transactions, transaction => ({
      ...transaction.toObject(),
      category: transaction.categoryId,
    }));

    res.status(200).json({
      success: true,
      data: updatedTransactions,
      message: 'Recent transactions retrieved successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      data: [],
      message: error.message || 'Something went wrong while retrieving recent transactions',
    });
  }
});
