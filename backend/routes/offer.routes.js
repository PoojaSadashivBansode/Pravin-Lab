/**
 * ===========================================
 *    OFFER ROUTES - Promotional Offers API
 * ===========================================
 * 
 * API endpoints for managing offers/coupons:
 * - GET /api/offers - Get active offers (public)
 * - POST /api/offers/validate - Validate coupon code
 * - POST /api/offers - Create offer (admin)
 * - PUT /api/offers/:id - Update offer (admin)
 * - DELETE /api/offers/:id - Delete offer (admin)
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import express from 'express';
import Offer from '../models/Offer.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   GET /api/offers
 * @desc    Get all active offers
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const now = new Date();

    const offers = await Offer.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
    .select('-usageCount -usageLimit -perUserLimit')
    .sort({ isFeatured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });

  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers'
    });
  }
});

/**
 * @route   POST /api/offers/validate
 * @desc    Validate a coupon code
 * @access  Private
 */
router.post('/validate', protect, async (req, res) => {
  try {
    const { couponCode, cartTotal } = req.body;

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    const offer = await Offer.findOne({
      couponCode: couponCode.toUpperCase()
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Check if active
    if (!offer.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is no longer active'
      });
    }

    // Check validity dates
    const now = new Date();
    if (offer.startDate > now) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is not yet valid'
      });
    }

    if (offer.endDate < now) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired'
      });
    }

    // Check usage limit
    if (offer.usageLimit && offer.usageCount >= offer.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has reached its usage limit'
      });
    }

    // Check minimum order value
    if (offer.minOrderValue && cartTotal < offer.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${offer.minOrderValue} required`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (offer.discountType === 'percentage') {
      discountAmount = (cartTotal * offer.discountValue) / 100;
      if (offer.maxDiscountAmount && discountAmount > offer.maxDiscountAmount) {
        discountAmount = offer.maxDiscountAmount;
      }
    } else {
      discountAmount = offer.discountValue;
    }

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        couponCode: offer.couponCode,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        discountAmount: Math.round(discountAmount),
        finalTotal: Math.round(cartTotal - discountAmount)
      }
    });

  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating coupon'
    });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   GET /api/offers/admin/all
 * @desc    Get all offers (including inactive)
 * @access  Admin
 */
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });

  } catch (error) {
    console.error('Admin get offers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers'
    });
  }
});

/**
 * @route   POST /api/offers
 * @desc    Create a new offer
 * @access  Admin
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const offer = await Offer.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offer
    });

  } catch (error) {
    console.error('Create offer error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating offer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/offers/:id
 * @desc    Update an offer
 * @access  Admin
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
    });

  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating offer'
    });
  }
});

/**
 * @route   DELETE /api/offers/:id
 * @desc    Delete an offer
 * @access  Admin
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully'
    });

  } catch (error) {
    console.error('Delete offer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting offer'
    });
  }
});

export default router;
