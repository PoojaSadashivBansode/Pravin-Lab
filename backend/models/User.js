/**
 * ===========================================
 *          USER MODEL - MongoDB Schema
 * ===========================================
 * 
 * This model defines the structure for user accounts.
 * Users can be patients booking tests or lab admins
 * managing the system.
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';  // For password hashing

// ============================================
// USER SCHEMA DEFINITION
// ============================================

/**
 * User Schema
 * 
 * Defines all fields for a user document in MongoDB.
 * Includes authentication, profile, and role information.
 */
const userSchema = new mongoose.Schema({

  // ==========================================
  // AUTHENTICATION FIELDS
  // ==========================================

  /**
   * Email Address
   * Used as unique identifier for login
   * @type {String}
   * @required - Must be provided
   * @unique - No duplicate emails allowed
   * @example "john.doe@example.com"
   */
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,  // Converts to lowercase before saving
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },

  /**
   * Password
   * Hashed password for authentication
   * @type {String}
   * @required - Required for local auth, optional for Google auth
   * @minlength 6 - Minimum 6 characters
   * @note Password is hashed before saving (see pre-save hook)
   */
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false  // Don't include password in queries by default
    // Note: Not required because Google OAuth users won't have a password
  },

  // ==========================================
  // GOOGLE OAUTH FIELDS
  // ==========================================

  /**
   * Google ID
   * Unique identifier from Google OAuth
   * @type {String}
   * @example "118234567890123456789"
   */
  googleId: {
    type: String,
    sparse: true  // Allows null values while maintaining uniqueness
  },

  /**
   * Authentication Provider
   * Tracks how user registered/logs in
   * @type {String}
   * @enum ['local', 'google']
   * @default 'local'
   * 
   * Providers:
   * - 'local': Email/password registration
   * - 'google': Google OAuth login
   */
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },

  // ==========================================
  // PROFILE INFORMATION
  // ==========================================

  /**
   * Full Name
   * User's complete name
   * @type {String}
   * @required - Must be provided
   * @example "John Doe"
   */
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  /**
   * Phone Number
   * Contact number for communication and OTP
   * @type {String}
   * @example "9876543210"
   */
  phone: {
    type: String,
    trim: true
  },

  /**
   * Date of Birth
   * Used for age calculation and medical records
   * @type {Date}
   * @example "1990-05-15"
   */
  dateOfBirth: {
    type: Date
  },

  /**
   * Gender
   * Patient's gender for medical context
   * @type {String}
   * @enum ['male', 'female', 'other']
   */
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },

  /**
   * Profile Picture
   * URL or path to user's profile image
   * @type {String}
   * @example "/uploads/profiles/user123.jpg"
   */
  profileImage: {
    type: String
  },

  // ==========================================
  // ADDRESS INFORMATION
  // ==========================================

  /**
   * Address Object
   * Complete address for home collection and reports
   */
  address: {
    /**
     * Street Address
     * @example "123 Main Street, Apt 4B"
     */
    street: {
      type: String,
      trim: true
    },

    /**
     * City
     * @example "Mumbai"
     */
    city: {
      type: String,
      trim: true
    },

    /**
     * State
     * @example "Maharashtra"
     */
    state: {
      type: String,
      trim: true
    },

    /**
     * PIN Code
     * @example "400001"
     */
    pincode: {
      type: String,
      trim: true
    }
  },

  // ==========================================
  // ROLE & PERMISSIONS
  // ==========================================

  /**
   * User Role
   * Determines access level and permissions
   * @type {String}
   * @enum ['user', 'admin'] 
   * @default 'user'
   * 
   * Roles:
   * - 'user': Regular patient/customer
   * - 'admin': Lab administrator with full access
   */
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // ==========================================
  // ACCOUNT STATUS
  // ==========================================

  /**
   * Email Verification Status
   * Whether user has verified their email
   * @type {Boolean}
   * @default false
   */
  isEmailVerified: {
    type: Boolean,
    default: false
  },

  /**
   * Phone Verification Status
   * Whether user has verified their phone via OTP
   * @type {Boolean}
   * @default false
   */
  isPhoneVerified: {
    type: Boolean,
    default: false
  },

  /**
   * Account Active Status
   * Inactive accounts cannot login
   * @type {Boolean}
   * @default true
   */
  isActive: {
    type: Boolean,
    default: true
  },

  // ==========================================
  // PASSWORD RESET FIELDS
  // ==========================================

  /**
   * Password Reset Token
   * Temporary token for password reset functionality
   * @type {String}
   */
  resetPasswordToken: {
    type: String
  },

  /**
   * Password Reset Token Expiry
   * Token becomes invalid after this time
   * @type {Date}
   */
  resetPasswordExpire: {
    type: Date
  },

  // ==========================================
  // METADATA
  // ==========================================

  /**
   * Last Login Timestamp
   * Track when user last logged in
   * @type {Date}
   */
  lastLogin: {
    type: Date
  }

}, {
  /**
   * Schema Options
   * timestamps: true - Automatically adds createdAt and updatedAt fields
   */
  timestamps: true
});

// ============================================
// PRE-SAVE MIDDLEWARE (Hooks)
// ============================================

/**
 * Hash Password Before Saving
 * 
 * This middleware runs before every save() operation.
 * It automatically hashes the password if it has been modified.
 * 
 * @param {Function} next - Callback to continue the save operation
 */
userSchema.pre('save', async function(next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt (random data to make hash unique)
    // Higher number = more secure but slower (10-12 is recommended)
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (error) {
    next(error);
  }
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Compare Password
 * 
 * Compares a plain text password with the hashed password in database.
 * Used during login to verify user credentials.
 * 
 * @param {String} candidatePassword - Plain text password to compare
 * @returns {Promise<Boolean>} - True if passwords match, false otherwise
 * 
 * @example
 * const isMatch = await user.comparePassword('mypassword123');
 * if (isMatch) {
 *   // Password is correct, proceed with login
 * }
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  // bcrypt.compare handles the hashing and comparison
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Get Public Profile
 * 
 * Returns user data without sensitive fields like password.
 * Useful for sending user data to frontend.
 * 
 * @returns {Object} - User object without sensitive data
 */
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  
  return userObject;
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Find User by Email
 * 
 * Static method to find a user by their email address.
 * Includes password field for authentication purposes.
 * 
 * @param {String} email - Email to search for
 * @returns {Promise<User>} - User document or null
 * 
 * @example
 * const user = await User.findByEmail('john@example.com');
 */
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

// ============================================
// MODEL CREATION & EXPORT
// ============================================

/**
 * User Model
 * 
 * Creates a Mongoose model from the schema.
 * Model name 'User' will create a 'users' collection in MongoDB.
 */
const User = mongoose.model('User', userSchema);

// Export the model for use in routes and controllers
export default User;
