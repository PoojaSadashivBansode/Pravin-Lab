/**
 * ===========================================
 *    ORDER ROUTES - Order Management API
 * ===========================================
 * 
 * API endpoints for managing orders:
 * - GET /api/orders - Get user's orders
 * - GET /api/orders/:id - Get single order
 * - POST /api/orders - Create new order
 * - PUT /api/orders/:id/status - Update order status (admin)
 * - GET /api/orders/admin/all - Get all orders (admin)
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import express from 'express';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============================================
// USER ROUTES
// ============================================

/**
 * @route   GET /api/orders
 * @desc    Get current user's orders
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('tests.test', 'name')
      .populate('packages.package', 'name');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('tests.test')
      .populate('packages.package');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check ownership (unless admin)
    if (order.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
});

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const {
      tests,
      packages,
      subtotal,
      discountAmount,
      couponCode,
      totalAmount,
      collectionType,
      collectionAddress,
      preferredDate,
      preferredTimeSlot,
      paymentMethod,
      specialInstructions
    } = req.body;

    // Validation
    if ((!tests || tests.length === 0) && (!packages || packages.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one test or package'
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.phone || '',
      tests,
      packages,
      subtotal,
      discountAmount,
      couponCode,
      totalAmount,
      collectionType,
      collectionAddress,
      preferredDate,
      preferredTimeSlot,
      paymentMethod,
      specialInstructions,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   GET /api/orders/admin/all
 * @desc    Get all orders (admin)
 * @access  Admin
 */
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders
    });

  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (admin)
 * @access  Admin
 */
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus, adminNotes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (adminNotes) order.adminNotes = adminNotes;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order'
    });
  }
});

/**
 * @route   PUT /api/orders/:id/reports
 * @desc    Add report to order (admin)
 * @access  Admin
 */
router.put('/:id/reports', protect, adminOnly, async (req, res) => {
  try {
    const { name, url } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        message: 'Name and URL are required'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.reports.push({ name, url });
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Report added successfully',
      data: order
    });

  } catch (error) {
    console.error('Add report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding report'
    });
  }
});

export default router;
