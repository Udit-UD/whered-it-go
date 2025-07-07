import express from 'express';
import {
  register,
  login,
  getProfile,
  validateRegister,
  validateLogin,
  validateGoogleLogin,
  googleLogin,
} from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/oauth/google', validateGoogleLogin, googleLogin);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;
