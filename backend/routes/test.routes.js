/**
 * ===========================================
 *      TEST ROUTES - Admin CRUD Operations
 * ===========================================
 * 
 * API endpoints for managing lab tests:
 * - GET /api/tests - Get all tests (public)
 * - GET /api/tests/:id - Get single test (public)
 * - POST /api/tests - Create test (admin)
 * - PUT /api/tests/:id - Update test (admin)
 * - DELETE /api/tests/:id - Delete test (admin)
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import express from 'express';
import Test from '../models/Test.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   GET /api/tests
 * @desc    Get all active tests
 * @access  Public
 * 
 * @query   {String} category - Filter by category
 * @query   {String} search - Search by name
 * @query   {Number} limit - Limit results
 * @query   {Number} page - Page number for pagination
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50, page = 1 } = req.query;

    // Build query
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const tests = await Test.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Test.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: tests
    });

  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tests'
    });
  }
});

/**
 * @route   GET /api/tests/:id
 * @desc    Get single test by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.status(200).json({
      success: true,
      data: test
    });

  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test'
    });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   POST /api/tests/bulk-import
 * @desc    Bulk import tests from JSON array
 * @access  Admin
 * 
 * @body    {Array} tests - Array of test objects to import
 * 
 * NOTE: This route MUST come before /:id route to avoid conflicts
 */
router.post('/bulk-import', protect, adminOnly, async (req, res) => {
  try {
    const { tests } = req.body;

    // Validation
    if (!tests || !Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of tests to import'
      });
    }

    const results = {
      success: [],
      errors: [],
      total: tests.length
    };

    // Process each test
    for (let i = 0; i < tests.length; i++) {
      const testData = tests[i];
      const lineNumber = i + 1;

      try {
        // Validate required fields
        if (!testData.name || !testData.price) {
          results.errors.push({
            line: lineNumber,
            name: testData.name || 'Unknown',
            error: 'Name and price are required'
          });
          continue;
        }

        // Check for duplicate test name
        const existingTest = await Test.findOne({ name: testData.name });
        if (existingTest) {
          results.errors.push({
            line: lineNumber,
            name: testData.name,
            error: 'Test with this name already exists'
          });
          continue;
        }

        // Create test
        const test = await Test.create({
          name: testData.name,
          description: testData.description,
          price: testData.price,
          discountPrice: testData.discountPrice,
          category: testData.category,
          sampleType: testData.sampleType,
          reportTime: testData.reportTime,
          parameters: testData.parameters || [],
          preparationInstructions: testData.preparationInstructions,
          isActive: testData.isActive !== undefined ? testData.isActive : true
        });

        results.success.push({
          line: lineNumber,
          name: test.name,
          id: test._id
        });

      } catch (error) {
        results.errors.push({
          line: lineNumber,
          name: testData.name || 'Unknown',
          error: error.message
        });
      }
    }

    // Send response
    res.status(results.errors.length > 0 ? 207 : 201).json({
      success: results.errors.length === 0,
      message: `Import completed: ${results.success.length} successful, ${results.errors.length} failed`,
      data: results
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during bulk import',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/tests/admin/all
 * @desc    Get all tests (including inactive) for admin
 * @access  Admin
 */
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests
    });

  } catch (error) {
    console.error('Admin get tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tests'
    });
  }
});

/**
 * @route   POST /api/tests
 * @desc    Create a new test
 * @access  Admin
 * 
 * @body    {String} name - Test name (required)
 * @body    {String} description - Test description
 * @body    {Number} price - Test price (required)
 * @body    {Number} discountPrice - Discounted price
 * @body    {String} category - Test category
 * @body    {String} sampleType - Sample type required
 * @body    {String} reportTime - Report turnaround time
 * @body    {Array} parameters - Test parameters
 * @body    {String} preparationInstructions - Patient instructions
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      sampleType,
      reportTime,
      parameters,
      preparationInstructions
    } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    // Create test
    const test = await Test.create({
      name,
      description,
      price,
      discountPrice,
      category,
      sampleType,
      reportTime,
      parameters,
      preparationInstructions
    });

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: test
    });

  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/tests/:id
 * @desc    Update a test
 * @access  Admin
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Update fields
    const updateFields = [
      'name', 'description', 'price', 'discountPrice',
      'category', 'sampleType', 'reportTime', 'parameters',
      'preparationInstructions', 'isActive'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        test[field] = req.body[field];
      }
    });

    await test.save();

    res.status(200).json({
      success: true,
      message: 'Test updated successfully',
      data: test
    });

  } catch (error) {
    console.error('Update test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating test'
    });
  }
});

/**
 * @route   DELETE /api/tests/:id
 * @desc    Delete a test (soft delete by setting isActive to false)
 * @access  Admin
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    // Soft delete - set isActive to false
    test.isActive = false;
    await test.save();

    res.status(200).json({
      success: true,
      message: 'Test deleted successfully'
    });

  } catch (error) {
    console.error('Delete test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting test'
    });
  }
});

export default router;
