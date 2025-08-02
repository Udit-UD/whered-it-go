import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  _id: string;
  userId: mongoose.Schema.Types.ObjectId;
  totalAmount: number;
  note?: string;
  month: string; // format: YYYY-MM
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
  {
    totalAmount: {
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
    month: {
      type: String,
      required: [true, 'Month is required'],
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index to prevent duplicate budgets per user per month
budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

const Budget = mongoose.model<IBudget>('Budget', budgetSchema);

export default Budget;
