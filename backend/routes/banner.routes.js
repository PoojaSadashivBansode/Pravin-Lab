/**
 * ===========================================
 *    BANNER ROUTES - Banner Management API
 * ===========================================
 * 
 * API endpoints for managing banners:
 * - GET /api/banners - Get active banners (public)
 * - GET /api/banners/admin/all - Get all banners (admin)
 * - POST /api/banners - Create banner (admin)
 * - PUT /api/banners/:id - Update banner (admin)
 * - DELETE /api/banners/:id - Delete banner (admin)
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import express from 'express';
import Banner from '../models/Banner.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   GET /api/banners
 * @desc    Get active banners for a specific position
 * @access  Public
 * 
 * @query   {String} position - Banner position (home_hero, etc.)
 */
router.get('/', async (req, res) => {
  try {
    const { position } = req.query;
    
    // Build query - get all active banners
    const query = { isActive: true };
    
    // Optional: filter by position
    if (position) {
      query.position = position;
    }

    const banners = await Banner.find(query)
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });

  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching banners'
    });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   GET /api/banners/admin/all
 * @desc    Get all banners (including inactive)
 * @access  Admin
 */
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const banners = await Banner.find().sort({ position: 1, order: 1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });

  } catch (error) {
    console.error('Admin get banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching banners'
    });
  }
});

/**
 * @route   POST /api/banners
 * @desc    Create a new banner
 * @access  Admin
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      image,
      mobileImage,
      altText,
      buttonText,
      buttonLink,
      linkTarget,
      order,
      position,
      backgroundColor,
      textColor,
      startDate,
      endDate,
      isActive
    } = req.body;

    // Validation
    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: 'Title and image are required'
      });
    }

    const banner = await Banner.create({
      title,
      subtitle,
      description,
      image,
      mobileImage,
      altText,
      buttonText,
      buttonLink,
      linkTarget,
      order,
      position,
      backgroundColor,
      textColor,
      startDate,
      endDate,
      isActive
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner
    });

  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating banner',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/banners/:id
 * @desc    Update a banner
 * @access  Admin
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    // Update allowed fields
    const updateFields = [
      'title', 'subtitle', 'description', 'image', 'mobileImage',
      'altText', 'buttonText', 'buttonLink', 'linkTarget', 'order',
      'position', 'backgroundColor', 'textColor', 'startDate',
      'endDate', 'isActive'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        banner[field] = req.body[field];
      }
    });

    await banner.save();

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: banner
    });

  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating banner'
    });
  }
});

/**
 * @route   DELETE /api/banners/:id
 * @desc    Delete a banner
 * @access  Admin
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });

  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting banner'
    });
  }
});

/**
 * @route   PUT /api/banners/reorder
 * @desc    Reorder banners
 * @access  Admin
 */
router.put('/reorder', protect, adminOnly, async (req, res) => {
  try {
    const { banners } = req.body; // Array of { id, order }

    if (!banners || !Array.isArray(banners)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid banners array'
      });
    }

    // Update each banner's order
    await Promise.all(
      banners.map(({ id, order }) =>
        Banner.findByIdAndUpdate(id, { order })
      )
    );

    res.status(200).json({
      success: true,
      message: 'Banners reordered successfully'
    });

  } catch (error) {
    console.error('Reorder banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reordering banners'
    });
  }
});

export default router;
