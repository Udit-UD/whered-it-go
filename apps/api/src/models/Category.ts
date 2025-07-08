import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  _id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
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
    color: {
      type: String,
      required: [true, 'Category color is required'],
      trim: true,
      match: [/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color code'],
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
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
