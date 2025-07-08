# Backend API Setup

This document describes the backend API structure for the "Where'd It Go" personal finance tracker.

## Technology Stack

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: Database with Mongoose ODM
- **JWT**: Authentication
- **Winston**: Logging system
- **bcryptjs**: Password hashing

## Project Structure

```
src/server/
├── config/
│   ├── database.ts       # MongoDB connection
│   ├── index.ts         # Environment configuration
│   └── logger.ts        # Winston logger setup
├── controllers/
│   └── authController.ts # Authentication logic
├── middleware/
│   ├── authMiddleware.ts # JWT authentication
│   └── errorMiddleware.ts # Error handling
├── models/
│   ├── User.ts          # User schema
│   ├── Category.ts      # Category schema
│   └── Transaction.ts   # Transaction schema
├── routes/
│   ├── authRoutes.ts    # Authentication routes
│   ├── userRoutes.ts    # User routes
│   ├── categoryRoutes.ts # Category routes
│   └── transactionRoutes.ts # Transaction routes
├── services/
│   └── authService.ts   # JWT token management
├── utils/              # Utility functions
└── server.ts           # Main server file
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/whered-it-go

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   - Copy the environment variables above to `.env`
   - Update `MONGO_URI` with your MongoDB connection string
   - Change `JWT_SECRET` to a secure random string

3. **Start MongoDB**:
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

4. **Run the Backend Server**:

   ```bash
   # Development mode with hot reload
   npm run server

   # Production mode
   npm run server:prod

   # Run both frontend and backend
   npm run dev:full
   ```

5. **Test the API**:
   - Health check: `http://localhost:3001/api/health`
   - See `API_TESTING.md` for more examples

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: express-validator
- **Error Handling**: Centralized error middleware

## Logging

Winston logger is configured with:

- Console output (development)
- File logging (`logs/all.log`, `logs/error.log`)
- Different log levels based on environment

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Users

- `GET /api/users/profile` - User profile management (protected)

### Categories

- `GET /api/categories` - Category management (protected)

### Transactions

- `GET /api/transactions` - Transaction management (protected)

## Database Models

### User

- `email`: Unique email address
- `password`: Hashed password
- `firstName`: User's first name
- `lastName`: User's last name
- `timestamps`: Created/updated dates

### Category

- `name`: Category name
- `icon`: Emoji or icon identifier
- `color`: Hex color code
- `userId`: Reference to user
- `timestamps`: Created/updated dates

### Transaction

- `amount`: Transaction amount (positive for income, negative for expenses)
- `description`: Transaction description
- `categoryId`: Reference to category
- `date`: Transaction date
- `userId`: Reference to user
- `transactionType`: 'income' or 'expense'
- `timestamps`: Created/updated dates

## Next Steps

1. Implement remaining CRUD operations for categories and transactions
2. Add data validation and sanitization
3. Implement pagination for large datasets
4. Add transaction filtering and search
5. Create data analytics endpoints
6. Add unit and integration tests
7. Set up CI/CD pipeline
8. Add API documentation with Swagger

## Development Scripts

- `npm run server` - Start backend server with nodemon
- `npm run server:prod` - Start backend server in production mode
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
