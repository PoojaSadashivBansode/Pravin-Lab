/**
 * ===========================================
 *         OFFER MODEL - MongoDB Schema
 * ===========================================
 * 
 * This model defines the structure for promotional offers.
 * Used for discounts, coupons, and special promotions.
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import mongoose from 'mongoose';

// ============================================
// OFFER SCHEMA DEFINITION
// ============================================

const offerSchema = new mongoose.Schema({

  // ==========================================
  // BASIC INFORMATION
  // ==========================================

  /**
   * Offer Title
   * Display name for the offer
   * @type {String}
   * @required
   * @example "Summer Health Checkup - 30% Off!"
   */
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true
  },

  /**
   * Offer Description
   * Detailed description of the offer
   * @type {String}
   */
  description: {
    type: String,
    trim: true
  },

  /**
   * Coupon Code
   * Unique code for customers to apply
   * @type {String}
   * @unique
   * @example "SUMMER30"
   */
  couponCode: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },

  // ==========================================
  // DISCOUNT CONFIGURATION
  // ==========================================

  /**
   * Discount Type
   * @type {String}
   * @enum ['percentage', 'fixed']
   */
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },

  /**
   * Discount Value
   * Percentage (0-100) or fixed amount in INR
   * @type {Number}
   * @required
   */
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: 0
  },

  /**
   * Maximum Discount Amount
   * Cap on discount for percentage-based offers
   * @type {Number}
   * @example 500 (max ₹500 discount)
   */
  maxDiscountAmount: {
    type: Number
  },

  /**
   * Minimum Order Value
   * Minimum cart value required to use this offer
   * @type {Number}
   * @default 0
   */
  minOrderValue: {
    type: Number,
    default: 0
  },

  // ==========================================
  // VALIDITY
  // ==========================================

  /**
   * Start Date
   * When the offer becomes active
   * @type {Date}
   * @required
   */
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },

  /**
   * End Date
   * When the offer expires
   * @type {Date}
   * @required
   */
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },

  // ==========================================
  // USAGE LIMITS
  // ==========================================

  /**
   * Total Usage Limit
   * Maximum times this offer can be used across all users
   * @type {Number}
   * @example 1000
   */
  usageLimit: {
    type: Number
  },

  /**
   * Per User Limit
   * Maximum times a single user can use this offer
   * @type {Number}
   * @default 1
   */
  perUserLimit: {
    type: Number,
    default: 1
  },

  /**
   * Current Usage Count
   * How many times this offer has been used
   * @type {Number}
   * @default 0
   */
  usageCount: {
    type: Number,
    default: 0
  },

  // ==========================================
  // APPLICABILITY
  // ==========================================

  /**
   * Applicable For
   * What this offer can be applied to
   * @type {String}
   * @enum ['all', 'tests', 'packages', 'specific']
   */
  applicableFor: {
    type: String,
    enum: ['all', 'tests', 'packages', 'specific'],
    default: 'all'
  },

  /**
   * Specific Tests
   * If applicableFor is 'specific', list of applicable test IDs
   */
  applicableTests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  }],

  /**
   * Specific Packages
   * If applicableFor is 'specific', list of applicable package IDs
   */
  applicablePackages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  }],

  // ==========================================
  // STATUS
  // ==========================================

  /**
   * Active Status
   * @type {Boolean}
   * @default true
   */
  isActive: {
    type: Boolean,
    default: true
  },

  /**
   * Featured
   * Show on offers page prominently
   * @type {Boolean}
   * @default false
   */
  isFeatured: {
    type: Boolean,
    default: false
  },

  /**
   * Terms & Conditions
   * @type {String}
   */
  termsAndConditions: {
    type: String,
    trim: true
  }

}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

offerSchema.index({ couponCode: 1 }, { unique: true });
offerSchema.index({ isActive: 1 });
offerSchema.index({ startDate: 1, endDate: 1 });

// ============================================
// VIRTUAL: Is Valid Now
// ============================================

offerSchema.virtual('isValidNow').get(function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now &&
         (!this.usageLimit || this.usageCount < this.usageLimit);
});

// ============================================
// MODEL CREATION & EXPORT
// ============================================

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
