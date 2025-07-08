import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  _id: string;
  amount: number;
  description: string;
  categoryId: string;
  date: Date;
  userId: string;
  transactionType: 'income' | 'expense';
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      validate: {
        validator: function (value: number) {
          return value !== 0;
        },
        message: 'Amount cannot be zero',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    categoryId: {
      type: String,
      required: [true, 'Category ID is required'],
      ref: 'Category',
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    transactionType: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: {
        values: ['income', 'expense'],
        message: 'Transaction type must be either income or expense',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, categoryId: 1 });
transactionSchema.index({ userId: 1, transactionType: 1 });

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
