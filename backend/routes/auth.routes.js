/**
 * ===========================================
 *      AUTH ROUTES - Authentication API
 * ===========================================
 * 
 * Handles all authentication-related endpoints:
 * - User registration (local)
 * - User login (local)
 * - Google OAuth login
 * - Password reset
 * - Get current user profile
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

// ============================================
// ROUTER INITIALIZATION
// ============================================

const router = express.Router();

// ============================================
// GOOGLE OAUTH CLIENT SETUP
// ============================================

/**
 * Initialize Google OAuth2 Client
 * 
 * The client ID should be obtained from Google Cloud Console:
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a project (or select existing)
 * 3. Enable Google+ API
 * 4. Create OAuth 2.0 credentials
 * 5. Copy the Client ID
 */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate JWT Token
 * 
 * Creates a JSON Web Token for user authentication.
 * Token contains user ID and expires based on env setting.
 * 
 * @param {String} userId - MongoDB user ID
 * @returns {String} - Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Send Token Response
 * 
 * Helper to send consistent auth response with token and user data.
 * 
 * @param {User} user - User document
 * @param {Number} statusCode - HTTP status code
 * @param {Response} res - Express response object
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Generate JWT token
  const token = generateToken(user._id);

  // Get user data without sensitive fields
  const userData = user.getPublicProfile();

  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};

// ============================================
// ROUTES
// ============================================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user with email and password
 * @access  Public
 * 
 * @body    {String} name - User's full name
 * @body    {String} email - User's email address
 * @body    {String} password - User's password (min 6 chars)
 * @body    {String} phone - Optional phone number
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // ----------------------------------------
    // Validation
    // ----------------------------------------
    
    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // ----------------------------------------
    // Create User
    // ----------------------------------------
    
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      authProvider: 'local'
    });

    // Send response with token
    sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user with email and password
 * @access  Public
 * 
 * @body    {String} email - User's email address
 * @body    {String} password - User's password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ----------------------------------------
    // Validation
    // ----------------------------------------
    
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // ----------------------------------------
    // Find User & Verify Password
    // ----------------------------------------
    
    // Find user by email (include password field for verification)
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user registered with Google
    if (user.authProvider === 'google') {
      return res.status(400).json({
        success: false,
        message: 'This account uses Google login. Please sign in with Google.'
      });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // ----------------------------------------
    // Update Last Login & Send Response
    // ----------------------------------------
    
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/auth/google
 * @desc    Login or register user with Google OAuth
 * @access  Public
 * 
 * @body    {String} credential - Google ID token from frontend
 * 
 * Flow:
 * 1. Frontend gets Google ID token via Google Sign-In
 * 2. Frontend sends token to this endpoint
 * 3. Backend verifies token with Google
 * 4. Backend creates/finds user and returns JWT
 */
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    // ----------------------------------------
    // Validate Input
    // ----------------------------------------
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // ----------------------------------------
    // Verify Google Token
    // ----------------------------------------
    
    let payload;
    try {
      // Verify the ID token with Google
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      // Get user info from the verified token
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google credential'
      });
    }

    // Extract user information from Google payload
    const { sub: googleId, email, name, picture } = payload;

    // ----------------------------------------
    // Find or Create User
    // ----------------------------------------
    
    // First, check if user exists with this Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if user exists with this email (registered locally)
      user = await User.findOne({ email: email.toLowerCase() });

      if (user) {
        // User exists with email but not linked to Google
        // Link the Google account
        user.googleId = googleId;
        user.authProvider = 'google';
        if (!user.profileImage && picture) {
          user.profileImage = picture;
        }
        await user.save();
      } else {
        // Create new user with Google credentials
        user = await User.create({
          name,
          email: email.toLowerCase(),
          googleId,
          profileImage: picture,
          authProvider: 'google',
          isEmailVerified: true  // Google emails are pre-verified
        });
      }
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // ----------------------------------------
    // Update Last Login & Send Response
    // ----------------------------------------
    
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Error with Google authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private (requires token)
 * 
 * Note: This route should be protected by auth middleware
 * The middleware attaches user to req.user
 */
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user's profile
 * @access  Private (requires token)
 * 
 * @body    {String} name - User's full name
 * @body    {String} phone - User's phone number
 * @body    {Date} dateOfBirth - User's date of birth
 * @body    {String} gender - User's gender (male/female/other)
 * @body    {Object} address - User's address object
 */
router.put('/profile', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // ----------------------------------------
    // Update Profile Fields
    // ----------------------------------------
    
    const { name, phone, dateOfBirth, gender, address } = req.body;

    // Update basic fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;

    // Update address fields if provided
    if (address) {
      user.address = {
        street: address.street || user.address?.street,
        city: address.city || user.address?.city,
        state: address.state || user.address?.state,
        pincode: address.pincode || user.address?.pincode
      };
    }

    // Save updated user
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// ADMIN USER MANAGEMENT ROUTES
// ============================================

/**
 * @route   GET /api/auth/users
 * @desc    Get all registered users
 * @access  Admin only
 */
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

/**
 * @route   PUT /api/auth/users/:id/role
 * @desc    Update user role (promote to admin/demote to user)
 * @access  Admin only
 */
router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role'
    });
  }
});

// Export the router
export default router;
