import BudgetCategory from '../models/BudgetCategory';
import { asyncHandler } from '../middleware/errorMiddleware';
import Budget from '../models/Budget';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';
import { Response } from 'express';

export const getBudget = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  let month = req.query.month as string;

  if (!month) {
    month = new Date().toISOString().slice(0, 7); // Default to current month in YYYY-MM format
  }

  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const budget = await Budget.findOne({ userId, month });
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found for the specified month' });
    }

    res.status(200).json({
      success: true,
      budget,
      message: 'Budget retrieved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving budget',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export const createBudget = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { totalAmount, note, month } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!totalAmount || !month) {
      return res.status(400).json({
        message: 'Total amount and month are required',
        success: false,
      });
    }

    // Check if budget already exists for this user and month
    const existingBudget = await Budget.findOne({ userId, month });
    if (existingBudget) {
      return res.status(409).json({
        message: 'Budget already exists for this month',
        success: false,
      });
    }

    const budget = new Budget({
      userId,
      totalAmount,
      note,
      month,
    });

    const savedBudget = await budget.save();

    res.status(201).json({
      success: true,
      budget: savedBudget,
      message: 'Budget created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating budget',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export const copyBudget = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { fromMonth, toMonth } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!fromMonth || !toMonth) {
      return res.status(400).json({
        message: 'Both fromMonth and toMonth are required',
        success: false,
      });
    }

    // Find the source budget to copy from
    const sourceBudget = await Budget.findOne({ userId, month: fromMonth });
    if (!sourceBudget) {
      return res.status(404).json({
        message: 'Source budget not found for the specified month',
        success: false,
      });
    }

    // Check if budget already exists for the target month
    const existingBudget = await Budget.findOne({ userId, month: toMonth });
    if (existingBudget) {
      return res.status(409).json({
        message: 'Budget already exists for the target month',
        success: false,
      });
    }

    // Create new budget with copied data
    const newBudget = new Budget({
      userId,
      totalAmount: sourceBudget.totalAmount,
      note: sourceBudget.note,
      month: toMonth,
    });

    const savedBudget = await newBudget.save();

    res.status(201).json({
      success: true,
      budget: savedBudget,
      message: `Budget copied successfully from ${fromMonth} to ${toMonth}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error copying budget',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export const allocateBudgetCategory = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { budgetId, categoryId, allocatedAmount, note } = req.body;

    try {
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      if (!budgetId || !categoryId || allocatedAmount === undefined) {
        return res.status(400).json({
          message: 'Budget ID, Category ID, and allocated amount are required',
          success: false,
        });
      }

      // Find the budget to allocate to
      const budget = await Budget.findById(budgetId);
      if (!budget || budget.userId.toString() !== userId) {
        return res.status(404).json({
          message: 'Budget not found or does not belong to the user',
          success: false,
        });
      }

      // Create or update the budget category allocation
      const budgetCategory = await BudgetCategory.findOneAndUpdate(
        { budgetId, categoryId },
        { allocatedAmount, note },
        { new: true, upsert: true }
      );

      res.status(200).json({
        success: true,
        budgetCategory,
        message: 'Budget category allocated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error allocating budget category',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);
