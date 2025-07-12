import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
  icon: string;
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isCommon?: boolean; // Indicates if the category is a default category
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
    },
    icon: {
      type: String,
      required: [true, 'Category icon is required'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
    isCommon: {
      type: Boolean,
      default: false,
      description: 'Indicates if the category is a default category',
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for user-specific category names
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
