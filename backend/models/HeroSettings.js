/**
 * ===========================================
 *     HERO SETTINGS MODEL - MongoDB Schema
 * ===========================================
 * 
 * This model defines the structure for homepage hero section.
 * Allows admin to manage hero text content and hero image.
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import mongoose from 'mongoose';

// ============================================
// HERO SETTINGS SCHEMA DEFINITION
// ============================================

const heroSettingsSchema = new mongoose.Schema({

    // ==========================================
    // TEXT CONTENT
    // ==========================================

    /**
     * Hero Main Title
     * Primary heading displayed in hero section
     * @type {String}
     * @required
     * @example "Book Lab Tests Online"
     */
    title: {
        type: String,
        required: [true, 'Hero title is required'],
        trim: true,
        default: 'Book Lab Tests Online'
    },

    /**
     * Hero Subtitle
     * Highlighted text or secondary heading
     * @type {String}
     * @example "WITH TRUSTED DIAGNOSTICS"
     */
    subtitle: {
        type: String,
        trim: true,
        default: 'WITH TRUSTED DIAGNOSTICS'
    },

    /**
     * Hero Description
     * Supporting text/tagline
     * @type {String}
     * @example "Accurate reports • Home sample collection • Online payment"
     */
    description: {
        type: String,
        trim: true,
        default: 'Accurate reports • Home sample collection • Online payment'
    },

    // ==========================================
    // HERO IMAGE
    // ==========================================

    /**
     * Hero Image URL
     * Main image displayed in hero section
     * @type {String}
     * @required
     */
    heroImage: {
        type: String,
        required: [true, 'Hero image is required'],
        default: '/uploads/hero/default-lab-hero.webp'
    },

    /**
     * Image Alt Text
     * Alternative text for accessibility
     * @type {String}
     */
    imageAlt: {
        type: String,
        trim: true,
        default: 'Laboratory Hero Image'
    },

    // ==========================================
    // CALL TO ACTION (Optional)
    // ==========================================

    /**
     * CTA Button Text
     * Text displayed on primary action button
     * @type {String}
     * @example "Book Now"
     */
    ctaText: {
        type: String,
        trim: true,
        default: ''
    },

    /**
     * CTA Button Link
     * URL where button redirects
     * @type {String}
     * @example "/tests"
     */
    ctaLink: {
        type: String,
        trim: true,
        default: ''
    },

    // ==========================================
    // STATUS
    // ==========================================

    /**
     * Active Status
     * Only one hero setting can be active at a time
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
// MIDDLEWARE: Ensure Single Active Record
// ============================================

heroSettingsSchema.pre('save', async function (next) {
    if (this.isActive) {
        // Deactivate all other hero settings
        await this.constructor.updateMany(
            { _id: { $ne: this._id } },
            { isActive: false }
        );
    }
    next();
});

// ============================================
// INDEXES
// ============================================

heroSettingsSchema.index({ isActive: 1 });

// ============================================
// MODEL CREATION & EXPORT
// ============================================

const HeroSettings = mongoose.model('HeroSettings', heroSettingsSchema);

export default HeroSettings;
