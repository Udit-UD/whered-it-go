import { Request, Response, NextFunction } from 'express';
import Logger from '../config/logger';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as CustomError;
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction //eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  // Log error
  Logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // Mongoose duplicate key
  if (
    err.name === 'MongoServerError' &&
    'code' in err &&
    (err as { code: number }).code === 11000
  ) {
    message = 'Duplicate field value entered';
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const validationErrors = err as unknown as { errors: Record<string, { message: string }> };
    const errors = Object.values(validationErrors.errors).map(error => error.message);
    message = `Validation Error: ${errors.join(', ')}`;
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler =
  (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
