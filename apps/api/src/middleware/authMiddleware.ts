import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import Logger from '../config/logger';

interface JwtPayload {
  userId: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

      // Add user info to request object
      req.user = {
        id: decoded.userId,
        email: decoded.email,
      };

      return next();
    } catch (error) {
      Logger.error(`Token verification failed: ${error}`);
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
      return;
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
    return;
  }
};

export type { AuthenticatedRequest };
