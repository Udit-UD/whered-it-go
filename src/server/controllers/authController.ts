import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { generateToken } from '../services/authService';
import { asyncHandler } from '../middleware/errorMiddleware';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';
import Logger from '../config/logger';

// Validation middleware for registration
export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1, max: 50 }),
  body('lastName').trim().isLength({ min: 1, max: 50 }),
];

// Validation middleware for login
export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }

  const { email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({
      success: false,
      message: 'User already exists with this email',
    });
    return;
  }

  // Create user
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
  });

  // Generate token
  const token = generateToken(user._id, user.email);

  Logger.info(`New user registered: ${user.email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }

  const { email, password } = req.body;

  // Check for user and include password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
    return;
  }

  // Check password
  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
    return;
  }

  // Generate token
  const token = generateToken(user._id, user.email);

  Logger.info(`User logged in: ${user.email}`);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
    return;
  }

  const user = await User.findById(userId);
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
});
