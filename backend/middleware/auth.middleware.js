/**
 * ===========================================
 *     AUTH MIDDLEWARE - Route Protection
 * ===========================================
 * 
 * Middleware for protecting routes:
 * - protect: Requires valid JWT token
 * - adminOnly: Requires admin role
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ============================================
// PROTECT MIDDLEWARE
// ============================================

/**
 * Protect Middleware
 * 
 * Verifies JWT token and attaches user to request.
 * Use this middleware on routes that require authentication.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 * 
 * @example
 * router.get('/protected', protect, (req, res) => {
 *   // req.user is now available
 * });
 */
export const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// ============================================
// ADMIN ONLY MIDDLEWARE
// ============================================

/**
 * Admin Only Middleware
 * 
 * Checks if the authenticated user has admin role.
 * Must be used AFTER the protect middleware.
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 * 
 * @example
 * router.get('/admin-only', protect, adminOnly, (req, res) => {
 *   // Only admins can access this route
 * });
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }

  next();
};
