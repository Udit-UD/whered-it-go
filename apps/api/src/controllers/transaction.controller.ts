import { AuthenticatedRequest } from '@/middleware/authMiddleware';
import { asyncHandler } from '@/middleware/errorMiddleware';
import { Response } from 'express';
import Transaction from '@/models/Transaction';

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
