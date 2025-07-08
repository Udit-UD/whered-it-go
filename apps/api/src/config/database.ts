import mongoose from 'mongoose';
import Logger from './logger';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI);

    Logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    Logger.error(`Database connection error: ${error}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  Logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', err => {
  Logger.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  Logger.warn('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    Logger.info('MongoDB connection closed due to app termination');
    process.exit(0);
  } catch (err) {
    Logger.error(`Error during graceful shutdown: ${err}`);
    process.exit(1);
  }
});

export default connectDB;
