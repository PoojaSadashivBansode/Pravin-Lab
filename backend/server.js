/**
 * ===========================================
 *      PRAVIN LAB BACKEND - MAIN SERVER
 * ===========================================
 * 
 * This is the main entry point for the Pravin Lab API.
 * It sets up Express server, connects to MongoDB, and
 * configures all necessary middleware.
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

// ============================================
// IMPORTS - Required packages and modules
// ============================================
import express from 'express';       // Web framework for Node.js
import cors from 'cors';             // Enable Cross-Origin Resource Sharing
import dotenv from 'dotenv';         // Load environment variables from .env file
import mongoose from 'mongoose';     // MongoDB Object Data Modeling (ODM)

// ============================================
// CONFIGURATION - Load environment variables
// ============================================
// dotenv.config() reads the .env file and makes variables 
// accessible via process.env.VARIABLE_NAME
dotenv.config();

// ============================================
// EXPRESS APP INITIALIZATION
// ============================================
// Create an Express application instance
const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================

/**
 * CORS Middleware
 * Allows requests from different origins (e.g., frontend on different port)
 * This is essential for API to work with React frontend
 */
app.use(cors());

/**
 * JSON Body Parser
 * Parses incoming requests with JSON payloads
 * Makes req.body available with parsed JSON data
 */
app.use(express.json());

/**
 * URL Encoded Body Parser
 * Parses incoming requests with URL-encoded payloads
 * extended: true allows for rich objects and arrays
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Static Files Middleware
 * Serves uploaded files (images, documents) from 'uploads' folder
 * Access via: http://localhost:5000/uploads/filename.jpg
 */
app.use('/uploads', express.static('uploads'));

// ============================================
// DATABASE CONNECTION
// ============================================

/**
 * Connect to MongoDB Database
 * 
 * Uses async/await for cleaner promise handling
 * Connection string is loaded from .env file for security
 * 
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the connection string from .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // Log error and exit process if connection fails
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Exit with failure code
  }
};

// ============================================
// API ROUTES
// ============================================

import authRoutes from './routes/auth.routes.js';
import testRoutes from './routes/test.routes.js';
import packageRoutes from './routes/package.routes.js';
import orderRoutes from './routes/order.routes.js';
import offerRoutes from './routes/offer.routes.js';
import bannerRoutes from './routes/banner.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import heroSettingsRoutes from './routes/heroSettings.routes.js';


/**
 * Root Route - API Health Check
 * 
 * @route   GET /
 * @desc    Check if API is running
 * @access  Public
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Pravin Lab API is running',
    version: '1.0.0'
  });
});

/**
 * Auth Routes
 * Handles: /api/auth/register, /api/auth/login, /api/auth/google, /api/auth/me, /api/auth/profile
 */
app.use('/api/auth', authRoutes);

/**
 * Test Routes
 * Handles: /api/tests - CRUD operations for lab tests
 */
app.use('/api/tests', testRoutes);

/**
 * Package Routes
 * Handles: /api/packages - CRUD operations for test packages
 */
app.use('/api/packages', packageRoutes);

/**
 * Order Routes
 * Handles: /api/orders - Order management
 */
app.use('/api/orders', orderRoutes);

/**
 * Offer Routes
 * Handles: /api/offers - Promotional offers and coupons
 */
app.use('/api/offers', offerRoutes);

/**
 * Banner Routes
 * Handles: /api/banners - Homepage banners
 */
app.use('/api/banners', bannerRoutes);

/**
 * Booking Routes
 * Handles: /api/bookings - Sample collection appointments
 */
app.use('/api/bookings', bookingRoutes);

/**
 * Hero Settings Routes
 * Handles: /api/hero-settings - Homepage hero section management
 */
app.use('/api/hero-settings', heroSettingsRoutes);


/**
 * Upload Routes
 * Handles: /api/upload - File uploads
 */
import uploadRoutes from './routes/upload.routes.js';
import statsRoutes from './routes/stats.routes.js';
import settingsRoutes from './routes/settings.routes.js';
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/settings', settingsRoutes);

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

/**
 * Global Error Handler
 * 
 * Catches all errors thrown in the application
 * Must be defined after all other middleware and routes
 * 
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
app.use((err, req, res, next) => {
  // Log the error stack trace for debugging
  console.error('🔥 Error:', err.stack);

  // Send a generic error response
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============================================
// SERVER STARTUP
// ============================================

// Get port from environment variables or use 5000 as default
const PORT = process.env.PORT || 5000;

/**
 * Start the server after database connection is established
 * This ensures we don't accept requests until DB is ready
 */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
  });
});

// Export app for testing purposes
export default app;
