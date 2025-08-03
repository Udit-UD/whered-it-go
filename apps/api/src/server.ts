import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

import config from './config';
import connectDB from './config/database';
import Logger from './config/logger';
import { errorHandler, notFound } from './middleware/errorMiddleware';

// Import routes (we'll create these next)
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes';

const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(
  morgan('combined', {
    stream: { write: message => Logger.http(message.trim()) },
  })
);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Whered-it-go API is running',
    status: 'OK',
    environment: config.nodeEnv,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = config.port || process.env.PORT || 5000;
  app.listen(PORT, () => {
    Logger.info(`Server running on port ${PORT}`);
    Logger.info(`Environment: ${config.nodeEnv}`);
  });
}

export default app;
