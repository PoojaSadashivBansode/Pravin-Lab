/**
 * ===========================================
 *        BOOKING MODEL - MongoDB Schema
 * ===========================================
 * 
 * This model defines the structure for appointment bookings.
 * Used for scheduling sample collection visits.
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import mongoose from 'mongoose';

// ============================================
// BOOKING SCHEMA DEFINITION
// ============================================

const bookingSchema = new mongoose.Schema({

  // ==========================================
  // REFERENCES
  // ==========================================

  /**
   * Order Reference
   * Links booking to the related order
   * @type {ObjectId}
   * @ref 'Order'
   */
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },

  /**
   * User Reference
   * @type {ObjectId}
   * @ref 'User'
   */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // ==========================================
  // PATIENT INFORMATION
  // ==========================================

  /**
   * Patient Name
   * Person whose sample will be collected
   * @type {String}
   */
  patientName: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },

  /**
   * Patient Age
   * @type {Number}
   */
  patientAge: {
    type: Number
  },

  /**
   * Patient Gender
   * @type {String}
   */
  patientGender: {
    type: String,
    enum: ['male', 'female', 'other']
  },

  /**
   * Contact Phone
   * @type {String}
   */
  contactPhone: {
    type: String,
    required: true,
    trim: true
  },

  // ==========================================
  // APPOINTMENT DETAILS
  // ==========================================

  /**
   * Booking Date
   * Scheduled date for sample collection
   * @type {Date}
   * @required
   */
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },

  /**
   * Time Slot
   * Scheduled time window
   * @type {String}
   * @example "9:00 AM - 11:00 AM"
   */
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    trim: true
  },

  /**
   * Collection Type
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
  address: {
    street: { type: String, trim: true },
    landmark: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true }
  },

  // ==========================================
  // PHLEBOTOMIST ASSIGNMENT
  // ==========================================

  /**
   * Assigned Phlebotomist
   * Staff member assigned for collection
   * @type {String}
   */
  assignedTo: {
    type: String,
    trim: true
  },

  /**
   * Phlebotomist Phone
   * @type {String}
   */
  collectorPhone: {
    type: String,
    trim: true
  },

  // ==========================================
  // STATUS & TRACKING
  // ==========================================

  /**
   * Booking Status
   * @type {String}
   * @enum ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled']
   */
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },

  /**
   * Sample Collected At
   * Actual time when sample was collected
   * @type {Date}
   */
  sampleCollectedAt: {
    type: Date
  },

  /**
   * Cancellation Reason
   * @type {String}
   */
  cancellationReason: {
    type: String,
    trim: true
  },

  /**
   * Rescheduled From
   * Previous date if booking was rescheduled
   * @type {Date}
   */
  rescheduledFrom: {
    type: Date
  },

  // ==========================================
  // ADDITIONAL INFO
  // ==========================================

  /**
   * Special Instructions
   * Notes for the phlebotomist
   * @type {String}
   */
  specialInstructions: {
    type: String,
    trim: true
  },

  /**
   * Admin Notes
   * Internal notes
   * @type {String}
   */
  adminNotes: {
    type: String,
    trim: true
  }

}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

bookingSchema.index({ order: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ assignedTo: 1 });

// ============================================
// MODEL CREATION & EXPORT
// ============================================

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
