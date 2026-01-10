/**
 * STATS ROUTES - Dashboard Analytics API
 */

import express from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Test from '../models/Test.js';
import Package from '../models/Package.js';

const router = express.Router();

/**
 * @route   GET /api/stats/dashboard
 * @desc    Get dashboard statistics
 * @access  Admin
 */
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    // 1. Get counts
    const [
      usersCount,
      ordersCount,
      testsCount,
      packagesCount,
      pendingOrders,
      completedOrders,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }), // Only count regular users
      Order.countDocuments(),
      Test.countDocuments({ isActive: true }),
      Package.countDocuments({ isActive: true }),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ]);

    // 2. Get recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customerName totalAmount status createdAt paymentStatus');

    res.json({
      success: true,
      data: {
        counts: {
          users: usersCount,
          orders: ordersCount,
          tests: testsCount,
          packages: packagesCount,
          pendingOrders,
          completedOrders,
          revenue: totalRevenue[0]?.total || 0
        },
        recentOrders
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

export default router;
