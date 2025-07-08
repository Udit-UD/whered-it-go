import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { generateToken } from '../services/authService';
import { asyncHandler } from '../middleware/errorMiddleware';
import type { AuthenticatedRequest } from '../middleware/authMiddleware';
import Logger from '../config/logger';
import firebaseAdmin from '../services/firebaseAdmin';

// Enhanced validation middleware for registration
export const validateRegister = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'
    ),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
];

// Validation middleware for login
export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Validation for Google OAuth
export const validateGoogleLogin = [
  body('idToken')
    .notEmpty()
    .withMessage('Google ID token is required')
    .isLength({ min: 100 })
    .withMessage('Invalid Google ID token format'),
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

  // Create user with local auth provider
  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    authProvider: 'local',
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
        authProvider: user.authProvider,
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

  // Check if this is a Google OAuth user trying to login with password
  if (user.authProvider === 'google') {
    res.status(400).json({
      success: false,
      message: 'This account uses Google sign-in. Please use the Google login button.',
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
        authProvider: user.authProvider,
        lastLogin: new Date(),
      },
      token,
    },
  });
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }

  const { idToken } = req.body;

  try {
    // Verify the Google ID token with enhanced validation
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken, true);

    // Additional security checks
    if (!decodedToken.email_verified) {
      res.status(400).json({
        success: false,
        message: 'Google account email is not verified',
      });
      return;
    }

    // Check token freshness (issued within last 5 minutes)
    const now = Math.floor(Date.now() / 1000);
    if (now - decodedToken.iat > 300) {
      // 5 minutes
      res.status(401).json({
        success: false,
        message: 'Google ID token is too old',
      });
      return;
    }

    const { email, name, sub: googleId } = decodedToken;

    if (!email || !name || !googleId) {
      res.status(400).json({
        success: false,
        message: 'Required user information not available from Google',
      });
      return;
    }

    // Check if user already exists
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (user) {
      // If user exists with same email but different auth provider
      if (user.authProvider === 'local' && !user.googleId) {
        res.status(400).json({
          success: false,
          message:
            'An account with this email already exists. Please sign in with your password instead.',
        });
        return;
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user if not found
      const nameParts = name.split(' ');
      user = await User.create({
        email,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        authProvider: 'google',
        googleId,
        lastLogin: new Date(),
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email);

    Logger.info(`User logged in with Google: ${user.email}`);

    res.json({
      success: true,
      message: 'Google login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          authProvider: user.authProvider,
          lastLogin: user.lastLogin,
        },
        token,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    Logger.error(`Google login failed: ${errorMessage}`);

    res.status(401).json({
      success: false,
      message: 'Invalid Google ID token',
    });
  }
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
