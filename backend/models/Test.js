/**
 * ===========================================
 *          TEST MODEL - MongoDB Schema
 * ===========================================
 * 
 * This model defines the structure for lab tests.
 * Each test represents a diagnostic test offered by the lab
 * (e.g., Blood Test, Thyroid Panel, Lipid Profile, etc.)
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import mongoose from 'mongoose';

// ============================================
// TEST SCHEMA DEFINITION
// ============================================

/**
 * Test Schema
 * 
 * Defines all fields for a lab test document in MongoDB.
 * Uses Mongoose Schema for validation and structure.
 */
const testSchema = new mongoose.Schema({
  
  /**
   * Test Name
   * @type {String}
   * @required - Every test must have a name
   * @example "Complete Blood Count (CBC)"
   */
  name: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true  // Removes whitespace from both ends
  },

  /**
   * Test Description
   * Detailed information about what the test measures
   * @type {String}
   * @example "A complete blood count measures red blood cells, white blood cells, and platelets"
   */
  description: {
    type: String,
    trim: true
  },

  /**
   * Test Price (MRP)
   * Original/full price of the test in INR
   * @type {Number}
   * @required - Price must be specified
   * @example 500
   */
  price: {
    type: Number,
    required: [true, 'Test price is required']
  },

  /**
   * Discounted Price
   * Special/offer price if applicable
   * @type {Number}
   * @optional - Only set if there's a discount
   * @example 399
   */
  discountPrice: {
    type: Number
  },

  /**
   * Test Category
   * Classification of the test for filtering
   * @type {String}
   * @example "Hematology", "Biochemistry", "Microbiology"
   */
  category: {
    type: String,
    trim: true
  },

  /**
   * Sample Type
   * What type of sample is required for the test
   * @type {String}
   * @example "Blood", "Urine", "Stool", "Serum"
   */
  sampleType: {
    type: String,
    trim: true
  },

  /**
   * Report Turnaround Time
   * How long it takes to get the report
   * @type {String}
   * @example "Same Day", "24 Hours", "2-3 Days"
   */
  reportTime: {
    type: String,
    trim: true
  },

  /**
   * Test Parameters
   * List of individual parameters measured in the test
   * @type {Array<String>}
   * @example ["Hemoglobin", "RBC Count", "WBC Count", "Platelet Count"]
   */
  parameters: [{
    type: String
  }],

  /**
   * Preparation Instructions
   * Instructions for patient before the test
   * @type {String}
   * @example "Fasting for 10-12 hours required"
   */
  preparationInstructions: {
    type: String
  },

  /**
   * Active Status
   * Whether the test is currently offered
   * @type {Boolean}
   * @default true - Tests are active by default
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
 * Test Model
 * 
 * Creates a Mongoose model from the schema.
 * Model name 'Test' will create a 'tests' collection in MongoDB.
 */
const Test = mongoose.model('Test', testSchema);

// Export the model for use in routes and controllers
export default Test;
