/**
 * ===========================================
 *        BANNER MODEL - MongoDB Schema
 * ===========================================
 * 
 * This model defines the structure for homepage banners.
 * Used for promotional slides and announcements.
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import mongoose from 'mongoose';

// ============================================
// BANNER SCHEMA DEFINITION
// ============================================

const bannerSchema = new mongoose.Schema({

  // ==========================================
  // BASIC INFORMATION
  // ==========================================

  /**
   * Banner Title
   * Main heading displayed on banner
   * @type {String}
   * @required
   * @example "30% Off on All Health Checkups"
   */
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true
  },

  /**
   * Subtitle
   * Secondary text below title
   * @type {String}
   * @example "Book now and get instant discount"
   */
  subtitle: {
    type: String,
    trim: true
  },

  /**
   * Description
   * Additional text content
   * @type {String}
   */
  description: {
    type: String,
    trim: true
  },

  // ==========================================
  // MEDIA
  // ==========================================

  /**
   * Banner Image
   * URL to the banner image
   * @type {String}
   * @required
   */
  image: {
    type: String,
    required: [true, 'Banner image is required']
  },

  /**
   * Mobile Image
   * Separate image for mobile devices (optional)
   * @type {String}
   */
  mobileImage: {
    type: String
  },

  /**
   * Alt Text
   * Alternative text for accessibility
   * @type {String}
   */
  altText: {
    type: String,
    trim: true
  },

  // ==========================================
  // CALL TO ACTION
  // ==========================================

  /**
   * Button Text
   * Text displayed on CTA button
   * @type {String}
   * @example "Book Now"
   */
  buttonText: {
    type: String,
    trim: true
  },

  /**
   * Button Link
   * URL where button redirects
   * @type {String}
   * @example "/packages"
   */
  buttonLink: {
    type: String,
    trim: true
  },

  /**
   * Link Target
   * Open in same or new tab
   * @type {String}
   * @enum ['_self', '_blank']
   */
  linkTarget: {
    type: String,
    enum: ['_self', '_blank'],
    default: '_self'
  },

  // ==========================================
  // DISPLAY SETTINGS
  // ==========================================

  /**
   * Display Order
   * Order in which banner appears in slider
   * Lower numbers appear first
   * @type {Number}
   * @default 0
   */
  order: {
    type: Number,
    default: 0
  },

  /**
   * Banner Position
   * Where to display this banner
   * @type {String}
   * @enum ['home_hero', 'home_secondary', 'offers_page', 'tests_page']
   */
  position: {
    type: String,
    enum: ['home_hero', 'home_secondary', 'offers_page', 'tests_page'],
    default: 'home_hero'
  },

  /**
   * Background Color
   * Fallback background color if image fails
   * @type {String}
   * @example "#1e40af"
   */
  backgroundColor: {
    type: String,
    default: '#1e40af'
  },

  /**
   * Text Color
   * Color of text overlay
   * @type {String}
   * @enum ['light', 'dark']
   */
  textColor: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },

  // ==========================================
  // SCHEDULING
  // ==========================================

  /**
   * Start Date
   * When banner becomes visible
   * @type {Date}
   */
  startDate: {
    type: Date
  },

  /**
   * End Date
   * When banner expires
   * @type {Date}
   */
  endDate: {
    type: Date
  },

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
  }

}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

bannerSchema.index({ isActive: 1, position: 1 });
bannerSchema.index({ order: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

// ============================================
// VIRTUAL: Is Visible Now
// ============================================

bannerSchema.virtual('isVisibleNow').get(function() {
  const now = new Date();
  const startValid = !this.startDate || this.startDate <= now;
  const endValid = !this.endDate || this.endDate >= now;
  return this.isActive && startValid && endValid;
});

// ============================================
// MODEL CREATION & EXPORT
// ============================================

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
