/**
 * ===========================================
 *        PACKAGE MODEL - MongoDB Schema
 * ===========================================
 * 
 * This model defines the structure for test packages.
 * Packages bundle multiple tests together at a discounted price
 * (e.g., Full Body Checkup, Diabetes Panel, Heart Health Package)
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import mongoose from 'mongoose';

// ============================================
// PACKAGE SCHEMA DEFINITION
// ============================================

/**
 * Package Schema
 * 
 * Defines all fields for a test package document in MongoDB.
 * Packages contain references to multiple Test documents.
 */
const packageSchema = new mongoose.Schema({
  
  /**
   * Package Name
   * @type {String}
   * @required - Every package must have a name
   * @example "Full Body Health Checkup"
   */
  name: {
    type: String,
    required: [true, 'Package name is required'],
    trim: true  // Removes whitespace from both ends
  },

  /**
   * Package Description
   * Detailed information about what the package includes
   * @type {String}
   * @example "Comprehensive health checkup including 60+ parameters"
   */
  description: {
    type: String,
    trim: true
  },

  /**
   * Included Tests
   * Array of references to Test documents
   * @type {Array<ObjectId>}
   * @ref 'Test' - References the Test model
   * @example [ObjectId("..."), ObjectId("...")]
   * 
   * Use .populate('tests') to get full test details
   */
  tests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'  // Creates a relationship with Test model
  }],

  /**
   * Package Price (MRP)
   * Original/full price of the package in INR
   * @type {Number}
   * @required - Price must be specified
   * @example 2999
   */
  price: {
    type: Number,
    required: [true, 'Package price is required']
  },

  /**
   * Discounted Price
   * Special/offer price if applicable
   * @type {Number}
   * @optional - Only set if there's a discount
   * @example 1999
   */
  discountPrice: {
    type: Number
  },

  /**
   * Package Image
   * URL or path to the package banner/thumbnail image
   * @type {String}
   * @example "/uploads/packages/health-checkup.jpg"
   */
  image: {
    type: String
  },

  /**
   * Package Category
   * Classification for filtering and organization
   * @type {String}
   * @example "Full Body", "Diabetes", "Heart", "Women's Health"
   */
  category: {
    type: String,
    trim: true
  },

  /**
   * Popular Flag
   * Marks package as popular for homepage display
   * @type {Boolean}
   * @default false
   */
  isPopular: {
    type: Boolean,
    default: false
  },

  /**
   * Active Status
   * Whether the package is currently offered
   * @type {Boolean}
   * @default true - Packages are active by default
   */
  isActive: {
    type: Boolean,
    default: true
  }

}, {
  /**
   * Schema Options
   * timestamps: true - Automatically adds createdAt and updatedAt fields
   */
  timestamps: true
});

// ============================================
// MODEL CREATION & EXPORT
// ============================================

/**
 * Package Model
 * 
 * Creates a Mongoose model from the schema.
 * Model name 'Package' will create a 'packages' collection in MongoDB.
 */
const Package = mongoose.model('Package', packageSchema);

// Export the model for use in routes and controllers
export default Package;
