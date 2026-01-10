/**
 * ===========================================
 *    SETTINGS ROUTES - Configuration API
 * ===========================================
 * 
 * Endpoints for managing site-wide settings.
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import SiteSettings from '../models/SiteSettings.js';

const router = express.Router();

/**
 * @route   GET /api/settings
 * @desc    Get site settings
 * @access  Public (some fields), Private (full) 
 *          For simplicity, making it public but we could restrict sensitive info
 */
router.get('/', async (req, res) => {
  try {
    // Find the settings document (should be only one)
    let settings = await SiteSettings.findOne();

    // If no settings exist, create default
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings'
    });
  }
});

/**
 * @route   PUT /api/settings
 * @desc    Update site settings
 * @access  Admin Only
 */
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      siteName,
      tagline,
      contactEmail,
      contactPhone,
      address,
      socialLinks,
      enableBookings,
      enableOnlinePayment,
      maintenanceMode
    } = req.body;

    // Find and update or create if not exists
    // upsert: true creates it if it doesn't exist
    const settings = await SiteSettings.findOneAndUpdate(
      {}, // filter (empty matches first doc)
      {
        siteName,
        tagline,
        contactEmail,
        contactPhone,
        address,
        socialLinks,
        enableBookings,
        enableOnlinePayment,
        maintenanceMode
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings'
    });
  }
});

export default router;
