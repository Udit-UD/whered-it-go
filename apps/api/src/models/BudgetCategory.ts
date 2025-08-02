import mongoose, { Document, Schema } from 'mongoose';

export interface IBudgetCategory extends Document {
  _id: string;
  budgetId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  allocatedAmount: number;
  note?: string;
}

const budgetCategorySchema = new Schema<IBudgetCategory>(
  {
    allocatedAmount: {
      type: Number,
      required: [true, 'Amount is required'],
      validate: {
        validator: function (value: number) {
          return value !== 0;
        },
        message: 'Amount cannot be zero',
      },
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Note cannot be more than 200 characters'],
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'BudgetId is required'],
      ref: 'Budget',
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Category ID is required'],
      ref: 'Category',
    },
  },
  {
    timestamps: true,
  }
);

// Index to prevent duplicate budgets per user per month
budgetCategorySchema.index({ budgetId: 1, categoryId: 1 }, { unique: true });

const BudgetCategory = mongoose.model<IBudgetCategory>('BudgetCategory', budgetCategorySchema);

export default BudgetCategory;
