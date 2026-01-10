/**
 * ===========================================
 *         ORDER MODEL - MongoDB Schema
 * ===========================================
 * 
 * This model defines the structure for test/package orders.
 * Each order represents a customer booking for lab tests.
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import mongoose from 'mongoose';

// ============================================
// ORDER SCHEMA DEFINITION
// ============================================

const orderSchema = new mongoose.Schema({

  // ==========================================
  // CUSTOMER INFORMATION
  // ==========================================

  /**
   * User Reference
   * Links order to registered user (optional for guest orders)
   * @type {ObjectId}
   * @ref 'User'
   */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  /**
   * Customer Name
   * @type {String}
   * @required
   */
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },

  /**
   * Customer Email
   * @type {String}
   * @required
   */
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true
  },

  /**
   * Customer Phone
   * @type {String}
   * @required
   */
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },

  // ==========================================
  // ORDER ITEMS
  // ==========================================

  /**
   * Ordered Tests
   * Array of tests with their details at time of order
   */
  tests: [{
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test'
    },
    name: String,
    price: Number,
    discountPrice: Number
  }],

  /**
   * Ordered Packages
   * Array of packages with their details at time of order
   */
  packages: [{
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package'
    },
    name: String,
    price: Number,
    discountPrice: Number
  }],

  // ==========================================
  // PRICING
  // ==========================================

  /**
   * Subtotal
   * Total before discounts
   * @type {Number}
   */
  subtotal: {
    type: Number,
    required: true
  },

  /**
   * Discount Amount
   * Total discount applied
   * @type {Number}
   * @default 0
   */
  discountAmount: {
    type: Number,
    default: 0
  },

  /**
   * Coupon Code
   * Applied coupon/offer code
   * @type {String}
   */
  couponCode: {
    type: String,
    trim: true
  },

  /**
   * Total Amount
   * Final amount after discounts
   * @type {Number}
   * @required
   */
  totalAmount: {
    type: Number,
    required: true
  },

  // ==========================================
  // COLLECTION DETAILS
  // ==========================================

  /**
   * Collection Type
   * Whether sample is collected at home or lab
   * @type {String}
   * @enum ['home', 'lab']
   */
  collectionType: {
    type: String,
    enum: ['home', 'lab'],
    default: 'home'
  },

  /**
   * Collection Address (for home collection)
   */
  collectionAddress: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true }
  },

  /**
   * Preferred Date
   * Customer's preferred date for sample collection
   * @type {Date}
   */
  preferredDate: {
    type: Date
  },

  /**
   * Preferred Time Slot
   * @type {String}
   * @example "9:00 AM - 11:00 AM"
   */
  preferredTimeSlot: {
    type: String,
    trim: true
  },

  // ==========================================
  // ORDER STATUS
  // ==========================================

  /**
   * Order Status
   * Current status of the order
   * @type {String}
   * @enum ['pending', 'confirmed', 'sample_collected', 'processing', 'completed', 'cancelled']
   * @default 'pending'
   */
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'sample_collected', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },

  /**
   * Payment Status
   * @type {String}
   * @enum ['pending', 'paid', 'failed', 'refunded']
   * @default 'pending'
   */
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },

  /**
   * Payment Method
   * @type {String}
   * @enum ['online', 'cod', 'upi']
   */
  paymentMethod: {
    type: String,
    enum: ['online', 'cod', 'upi']
  },

  /**
   * Payment ID
   * Transaction ID from payment gateway
   * @type {String}
   */
  paymentId: {
    type: String
  },

  // ==========================================
  // ADDITIONAL INFO
  // ==========================================

  /**
   * Special Instructions
   * Any special notes from customer
   * @type {String}
   */
  specialInstructions: {
    type: String,
    trim: true
  },

  /**
   * Order Notes
   * Internal notes by admin/staff
   * @type {String}
   */
  adminNotes: {
    type: String,
    trim: true
  },

  /**
   * Report URLs
   * Links to uploaded report files
   */
  reports: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }]

}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ customerEmail: 1 });

// ============================================
// MODEL CREATION & EXPORT
// ============================================

const Order = mongoose.model('Order', orderSchema);

export default Order;
