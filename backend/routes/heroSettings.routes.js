/**
 * ===========================================
 *        HERO SETTINGS ROUTES
 * ===========================================
 * 
 * API endpoints for managing homepage hero section
 * 
 * @routes
 * GET    /api/hero-settings        - Get active hero settings
 * PUT    /api/hero-settings        - Update hero settings (admin)
 * POST   /api/hero-settings/upload - Upload hero image (admin)
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import HeroSettings from '../models/HeroSettings.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// MULTER CONFIGURATION - Hero Image Upload
// ============================================

const heroStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/hero');

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'hero-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadHero = multer({
    storage: heroStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed (jpeg, jpg, png, webp, gif)'));
    }
});

// ============================================
// @route   GET /api/hero-settings
// @desc    Get active hero settings
// @access  Public
// ============================================

router.get('/', async (req, res) => {
    try {
        let heroSettings = await HeroSettings.findOne({ isActive: true });

        // If no hero settings exist, create default
        if (!heroSettings) {
            heroSettings = await HeroSettings.create({
                title: 'Book Lab Tests Online',
                subtitle: 'WITH TRUSTED DIAGNOSTICS',
                description: 'Accurate reports • Home sample collection • Online payment',
                heroImage: '/uploads/hero/default-lab-hero.webp',
                isActive: true
            });
        }

        res.status(200).json({
            success: true,
            data: heroSettings
        });
    } catch (error) {
        console.error('Error fetching hero settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch hero settings',
            error: error.message
        });
    }
});

// ============================================
// @route   PUT /api/hero-settings
// @desc    Update hero settings
// @access  Private/Admin
// ============================================

router.put('/', protect, adminOnly, async (req, res) => {
    try {
        const { title, subtitle, description, heroImage, imageAlt, ctaText, ctaLink } = req.body;

        let heroSettings = await HeroSettings.findOne({ isActive: true });

        if (!heroSettings) {
            // Create new hero settings
            heroSettings = await HeroSettings.create({
                title,
                subtitle,
                description,
                heroImage,
                imageAlt,
                ctaText,
                ctaLink,
                isActive: true
            });
        } else {
            // Update existing hero settings
            heroSettings.title = title || heroSettings.title;
            heroSettings.subtitle = subtitle !== undefined ? subtitle : heroSettings.subtitle;
            heroSettings.description = description !== undefined ? description : heroSettings.description;
            heroSettings.heroImage = heroImage || heroSettings.heroImage;
            heroSettings.imageAlt = imageAlt !== undefined ? imageAlt : heroSettings.imageAlt;
            heroSettings.ctaText = ctaText !== undefined ? ctaText : heroSettings.ctaText;
            heroSettings.ctaLink = ctaLink !== undefined ? ctaLink : heroSettings.ctaLink;

            await heroSettings.save();
        }

        res.status(200).json({
            success: true,
            message: 'Hero settings updated successfully',
            data: heroSettings
        });
    } catch (error) {
        console.error('Error updating hero settings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update hero settings',
            error: error.message
        });
    }
});

// ============================================
// @route   POST /api/hero-settings/upload
// @desc    Upload hero image
// @access  Private/Admin
// ============================================

router.post('/upload', protect, adminOnly, uploadHero.single('heroImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        const imageUrl = `/uploads/hero/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Hero image uploaded successfully',
            imageUrl
        });
    } catch (error) {
        console.error('Error uploading hero image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload hero image',
            error: error.message
        });
    }
});

export default router;
