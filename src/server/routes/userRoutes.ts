import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { updateProfile, getUserProfile } from '../controllers/user.controller';

const router = express.Router();

router.get('/', authenticate, getUserProfile);
router.patch('/', authenticate, updateProfile);

export default router;
