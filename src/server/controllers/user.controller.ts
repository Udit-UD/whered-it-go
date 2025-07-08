import type { AuthenticatedRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/errorMiddleware';
import User from '../models/User';
import { Response } from 'express';

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
    return;
  }

  const { imageUrl } = req.body;

  // Validate input
  if (!imageUrl) {
    res.status(400).json({
      success: false,
      message: 'Image Url is required',
    });
    return;
  }

  // Update user profile
  const user = await User.findByIdAndUpdate(
    userId,
    { profilePicture: imageUrl },
    { new: true, runValidators: true }
  );

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        updatedAt: user.updatedAt,
      },
    },
  });
});

// @desc    Get user profile
// @route   GET /api/users/
// @access  Private
export const getUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
    return;
  }

  // Update user profile
  const user = await User.findById(userId).select('-password -__v');

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    });
    return;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        updatedAt: user.updatedAt,
        profilePicture: user.profilePicture,
      },
    },
  });
});
