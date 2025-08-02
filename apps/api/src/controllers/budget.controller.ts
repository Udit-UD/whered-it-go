import BudgetCategory from '../models/BudgetCategory';
import { asyncHandler } from '../middleware/errorMiddleware';
import Budget from '../models/Budget';
import { AuthenticatedRequest } from '@/middleware/authMiddleware';
import { Response } from 'express';
import _ from 'lodash';
import mongoose from 'mongoose';

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

    const budget = await Budget.aggregate([
      {
        $match: {
          $and: [{ userId: new mongoose.Types.ObjectId(userId) }, { month: month }],
        },
      },
      {
        $lookup: {
          from: 'budgetcategories',
          localField: '_id',
          foreignField: 'budgetId',
          as: 'allocatedCategories',
        },
      },
      { $unwind: '$allocatedCategories' },
      {
        $lookup: {
          from: 'categories',
          localField: 'allocatedCategories.categoryId',
          foreignField: '_id',
          as: 'allocatedCategories.category',
        },
      },
      { $unwind: '$allocatedCategories.category' },
      {
        $lookup: {
          from: 'transactions',
          let: {
            catId: '$allocatedCategories.categoryId',
            uid: '$userId',
            monthStr: '$month',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$uid'] },
                    { $eq: ['$categoryId', '$$catId'] },
                    {
                      $eq: [
                        {
                          $dateToString: { format: '%Y-%m', date: '$date' },
                        },
                        '$$monthStr',
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                spent: { $sum: '$amount' },
              },
            },
          ],
          as: 'allocatedCategories.spentInfo',
        },
      },
      {
        $unwind: {
          path: '$allocatedCategories.spentInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          budgetId: { $first: '$_id' },
          totalAmount: { $first: '$totalAmount' },
          allocatedCategories: { $push: '$allocatedCategories' },
        },
      },
      {
        $project: {
          _id: 0,
          budgetId: 1,
          totalAmount: 1,
          allocatedCategories: {
            $map: {
              input: '$allocatedCategories',
              as: 'ac',
              in: {
                allocatedAmount: '$$ac.allocatedAmount',
                note: '$$ac.note',
                id: '$$ac.category._id',
                name: '$$ac.category.name',
                color: '$$ac.category.color',
                icon: '$$ac.category.icon',
                spent: { $ifNull: ['$$ac.spentInfo.spent', 0] },
              },
            },
          },
        },
      },
    ]);

    if (_.isEmpty(budget)) {
      return res
        .status(200)
        .json({ message: 'Budget not found for the specified month', data: null });
    }

    res.status(200).json({
      success: true,
      data: budget[0],
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

export const bulkAllocateBudgetCategories = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const { totalAmount, note, allocations } = req.body as {
      totalAmount: number;
      note?: string;
      allocations: Array<{
        categoryId: string;
        allocatedAmount: number;
        note?: string;
      }>;
    };

    try {
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      if (!Array.isArray(allocations) || _.isEmpty(allocations)) {
        return res.status(400).json({
          message: 'Allocations array is required',
          success: false,
        });
      }

      const month = new Date().toISOString().slice(0, 7);

      // Check if budget exists for this user & month
      let budget = await Budget.findOne({ userId, month });

      if (!budget) {
        // Create a new budget if none exists
        budget = new Budget({
          userId,
          totalAmount: totalAmount,
          note,
          month,
        });
        await budget.save();
      }

      // Bulk create/update category allocations
      const results = await Promise.all(
        _.map(allocations, allocation =>
          BudgetCategory.findOneAndUpdate(
            { budgetId: budget._id, categoryId: allocation.categoryId },
            {
              allocatedAmount: allocation.allocatedAmount,
              note: allocation.note,
            },
            { new: true, upsert: true }
          )
        )
      );

      return res.status(200).json({
        success: true,
        message: 'Budget categories allocated successfully',
        data: {
          budgetId: budget._id,
          budgetCategories: results,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error allocating budget categories',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);
