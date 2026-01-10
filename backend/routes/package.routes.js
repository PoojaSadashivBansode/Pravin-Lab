/**
 * ===========================================
 *    PACKAGE ROUTES - Admin CRUD Operations
 * ===========================================
 * 
 * API endpoints for managing test packages:
 * - GET /api/packages - Get all packages (public)
 * - GET /api/packages/:id - Get single package (public)
 * - POST /api/packages - Create package (admin)
 * - PUT /api/packages/:id - Update package (admin)
 * - DELETE /api/packages/:id - Delete package (admin)
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import express from 'express';
import Package from '../models/Package.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============================================
// PUBLIC ROUTES
// ============================================

/**
 * @route   GET /api/packages
 * @desc    Get all active packages
 * @access  Public
 * 
 * @query   {String} category - Filter by category
 * @query   {Boolean} popular - Filter popular packages
 * @query   {Number} limit - Limit results
 */
router.get('/', async (req, res) => {
  try {
    const { category, popular, limit = 50 } = req.query;

    // Build query
    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    // Execute query with populated tests
    const packages = await Package.find(query)
      .populate('tests', 'name price sampleType')
      .sort({ isPopular: -1, name: 1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });

  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching packages'
    });
  }
});

/**
 * @route   GET /api/packages/:id
 * @desc    Get single package by ID with full test details
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
      .populate('tests');

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pkg
    });

  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching package'
    });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   POST /api/packages/bulk-import
 * @desc    Bulk import packages from JSON array
 * @access  Admin
 * 
 * @body    {Array} packages - Array of package objects to import
 * NOTE: Test names will be automatically converted to test IDs
 * NOTE: This route MUST come before /:id route to avoid conflicts
 */
router.post('/bulk-import', protect, adminOnly, async (req, res) => {
  try {
    const { packages } = req.body;

    // Validation
    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of packages to import'
      });
    }

    // Import Test model to resolve test names
    const Test = (await import('../models/Test.js')).default;

    const results = {
      success: [],
      errors: [],
      total: packages.length
    };

    // Process each package
    for (let i = 0; i < packages.length; i++) {
      const packageData = packages[i];
      const lineNumber = i + 1;

      try {
        // Validate required fields
        if (!packageData.name || !packageData.price) {
          results.errors.push({
            line: lineNumber,
            name: packageData.name || 'Unknown',
            error: 'Name and price are required'
          });
          continue;
        }

        // Check for duplicate package name
        const existingPackage = await Package.findOne({ name: packageData.name });
        if (existingPackage) {
          results.errors.push({
            line: lineNumber,
            name: packageData.name,
            error: 'Package with this name already exists'
          });
          continue;
        }

        // Resolve test names to IDs
        let testIds = [];
        if (packageData.tests && Array.isArray(packageData.tests)) {
          for (const testNameOrId of packageData.tests) {
            // If it's already an ObjectId, use it directly
            if (testNameOrId.match(/^[0-9a-fA-F]{24}$/)) {
              testIds.push(testNameOrId);
            } else {
              // Otherwise, look up test by name
              const test = await Test.findOne({ name: testNameOrId });
              if (test) {
                testIds.push(test._id);
              } else {
                throw new Error(`Test not found: ${testNameOrId}`);
              }
            }
          }
        }

        // Create package
        const pkg = await Package.create({
          name: packageData.name,
          description: packageData.description,
          tests: testIds,
          price: packageData.price,
          discountPrice: packageData.discountPrice,
          image: packageData.image,
          category: packageData.category,
          isPopular: packageData.isPopular || false,
          isActive: packageData.isActive !== undefined ? packageData.isActive : true
        });

        results.success.push({
          line: lineNumber,
          name: pkg.name,
          id: pkg._id,
          testsCount: testIds.length
        });

      } catch (error) {
        results.errors.push({
          line: lineNumber,
          name: packageData.name || 'Unknown',
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
 * @route   GET /api/packages/admin/all
 * @desc    Get all packages (including inactive) for admin
 * @access  Admin
 */
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const packages = await Package.find()
      .populate('tests', 'name price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });

  } catch (error) {
    console.error('Admin get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching packages'
    });
  }
});

/**
 * @route   POST /api/packages
 * @desc    Create a new package
 * @access  Admin
 * 
 * @body    {String} name - Package name (required)
 * @body    {String} description - Package description
 * @body    {Array} tests - Array of test IDs
 * @body    {Number} price - Package price (required)
 * @body    {Number} discountPrice - Discounted price
 * @body    {String} image - Package image URL
 * @body    {String} category - Package category
 * @body    {Boolean} isPopular - Mark as popular
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      tests,
      price,
      discountPrice,
      image,
      category,
      isPopular
    } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    // Create package
    const pkg = await Package.create({
      name,
      description,
      tests,
      price,
      discountPrice,
      image,
      category,
      isPopular
    });

    // Populate tests before returning
    await pkg.populate('tests', 'name price');

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: pkg
    });

  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating package',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/packages/:id
 * @desc    Update a package
 * @access  Admin
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Update fields
    const updateFields = [
      'name', 'description', 'tests', 'price', 'discountPrice',
      'image', 'category', 'isPopular', 'isActive'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        pkg[field] = req.body[field];
      }
    });

    await pkg.save();
    await pkg.populate('tests', 'name price');

    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      data: pkg
    });

  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating package'
    });
  }
});

/**
 * @route   DELETE /api/packages/:id
 * @desc    Delete a package (soft delete)
 * @access  Admin
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Soft delete
    pkg.isActive = false;
    await pkg.save();

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });

  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting package'
    });
  }
});

export default router;
