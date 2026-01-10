/**
 * ===========================================
 *     SITE SETTINGS MODEL - MongoDB Schema
 * ===========================================
 * 
 * Stores global configuration for the application.
 * Only one document should exist for this collection (Singleton).
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  
  // ==========================================
  // GENERAL INFO
  // ==========================================
  
  siteName: {
    type: String,
    default: 'Pravin Clinical Laboratory'
  },
  
  tagline: {
    type: String,
    default: 'Precision in Every Report'
  },

  // ==========================================
  // CONTACT INFORMATION
  // ==========================================
  
  contactEmail: {
    type: String,
    default: 'prashantkokate410@gmail.com'
  },
  
  contactPhone: {
    type: String,
    default: '+91 9970174501'
  },
  
  address: {
    street: { type: String, default: 'Bypass Road Near Krishnpriya Hall' },
    city: { type: String, default: 'Akluj' },
    state: { type: String, default: 'Maharashtra' },
    pincode: { type: String, default: '413101' },
    googleMapLink: { type: String, default: '' }
  },

  // ==========================================
  // SOCIAL MEDIA
  // ==========================================
  
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },

  // ==========================================
  // SYSTEM SETTINGS
  // ==========================================
  
  enableBookings: {
    type: Boolean,
    default: true
  },
  
  enableOnlinePayment: {
    type: Boolean,
    default: false
  },

  maintenanceMode: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

// Singleton Pattern: Prevent creating multiple settings documents
// (Logic typically handled in controller/service, but schema supports structure)

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

export default SiteSettings;
