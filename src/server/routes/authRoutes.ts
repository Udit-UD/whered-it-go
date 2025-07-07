import express from 'express';
import {
  register,
  login,
  getProfile,
  validateRegister,
  validateLogin,
} from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', authenticate, getProfile);

export default router;
