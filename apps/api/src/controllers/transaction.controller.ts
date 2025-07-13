import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';
import { Response } from 'express';
import Transaction from '../models/Transaction';
import User from '../models/User';
import _ from 'lodash';

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | '';

const validateTransactiondata = (data: any) => {
  _.map(data, value => {
    const { amount, description, categoryId, date, transactionType } = value;

    const isParticularValid = amount && description && categoryId && date && transactionType;
    if (!isParticularValid) {
      return false; // Break the loop
    }
  });

  return true;
};

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

    const savedTransaction = await transaction.save();

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
  const limit = parseInt(req.query.limit as string) || 20;
  const page = parseInt(req.query.page as string) || 1;
  const sort = req.query.sort as SortOption;

  try {
    const transactions = await Transaction.find({ userId })
      .populate('categoryId')
      .sort(
        (sort === 'date-desc' && { date: -1 }) ||
          (sort === 'date-asc' && { date: 1 }) ||
          (sort === 'amount-desc' && { amount: -1 }) ||
          (sort === 'amount-asc' && { amount: 1 }) ||
          {}
      )
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

export const bulkCreateTransactions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const transactionsData = req.body;

    if (!Array.isArray(transactionsData) || transactionsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transactions data',
      });
    }
    try {
      const isValid = validateTransactiondata(transactionsData);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Some properties are missing in the transactions data',
        });
      }

      const transactions = transactionsData.map(tx => ({
        ...tx,
        userId,
        date: new Date(tx.date),
      }));

      const createdTransactions = await Transaction.insertMany(transactions);
      console.log({ createdTransactions });
      res.status(201).json({
        success: true,
        data: createdTransactions,
        message: 'Transactions created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong while creating transactions',
      });
    }
  }
);

export const bulkUpdateTransactions = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const transactionsData = req.body;

    if (!Array.isArray(transactionsData) || transactionsData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transactions data',
      });
    }

    try {
      const isValid = validateTransactiondata(transactionsData);
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Some properties are missing in the transactions data',
        });
      }
      const updatedTransactions = await Promise.all(
        transactionsData.map(async tx => {
          const existingTransaction = await Transaction.findOne({
            _id: tx.id,
            userId,
          });
          if (!existingTransaction) {
            throw new Error(`Transaction with ID ${tx.id} not found`);
          }
          existingTransaction.description = tx.description.trim();
          existingTransaction.amount = Number(tx.amount);
          existingTransaction.categoryId = tx.categoryId;
          existingTransaction.date = new Date(tx.date);
          existingTransaction.transactionType = tx.transactionType || 'expense';
          return existingTransaction.save();
        })
      );
      res.status(200).json({
        success: true,
        data: updatedTransactions,
        message: 'Transactions updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong while updating transactions',
      });
    }
  }
);

export const deleteTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Transaction ID is required',
    });
  }

  try {
    const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong while deleting transaction',
    });
  }
});
