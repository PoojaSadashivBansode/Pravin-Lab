/**
 * ===========================================
 *  BOOKING ROUTES - Appointment Management API
 * ===========================================
 * 
 * API endpoints for managing sample collection bookings:
 * - GET /api/bookings - Get user's bookings
 * - GET /api/bookings/:id - Get single booking
 * - POST /api/bookings - Create new booking
 * - PUT /api/bookings/:id - Reschedule booking
 * - DELETE /api/bookings/:id - Cancel booking
 * 
 * @author Pravin Lab Team
 * @version 1.0.0
 */

import express from 'express';
import Booking from '../models/Booking.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// ============================================
// USER ROUTES
// ============================================

/**
 * @route   GET /api/bookings
 * @desc    Get current user's bookings
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .sort({ bookingDate: -1 })
            .populate('order');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
});

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('order');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check ownership (unless admin)
        if (booking.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking'
        });
    }
});

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    try {
        const {
            order,
            patientName,
            patientAge,
            patientGender,
            contactPhone,
            bookingDate,
            timeSlot,
            collectionType,
            address,
            specialInstructions
        } = req.body;

        // Validation
        if (!patientName || !contactPhone || !bookingDate || !timeSlot) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: patientName, contactPhone, bookingDate, timeSlot'
            });
        }

        // Create booking
        const booking = await Booking.create({
            order,
            user: req.user._id,
            patientName,
            patientAge,
            patientGender,
            contactPhone,
            bookingDate,
            timeSlot,
            collectionType: collectionType || 'home',
            address,
            specialInstructions,
            status: 'scheduled'
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });

    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   PUT /api/bookings/:id
 * @desc    Reschedule a booking
 * @access  Private
 */
router.put('/:id', protect, async (req, res) => {
    try {
        const { bookingDate, timeSlot } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check ownership
        if (booking.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this booking'
            });
        }

        // Update booking
        if (bookingDate && timeSlot) {
            booking.rescheduledFrom = booking.bookingDate;
            booking.bookingDate = bookingDate;
            booking.timeSlot = timeSlot;
            booking.status = 'rescheduled';
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking rescheduled successfully',
            data: booking
        });

    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking'
        });
    }
});

/**
 * @route   DELETE /api/bookings/:id
 * @desc    Cancel a booking
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
    try {
        const { reason } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check ownership
        if (booking.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        booking.status = 'cancelled';
        booking.cancellationReason = reason || 'Cancelled by user';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });

    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking'
        });
    }
});

// ============================================
// ADMIN ROUTES
// ============================================

/**
 * @route   GET /api/bookings/admin/all
 * @desc    Get all bookings (admin)
 * @access  Admin
 */
router.get('/admin/all', protect, adminOnly, async (req, res) => {
    try {
        const { status, date } = req.query;

        let query = {};
        if (status) query.status = status;
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.bookingDate = { $gte: startDate, $lte: endDate };
        }

        const bookings = await Booking.find(query)
            .sort({ bookingDate: 1 })
            .populate('user', 'name email')
            .populate('order');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.error('Admin get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings'
        });
    }
});

/**
 * @route   PUT /api/bookings/:id/assign
 * @desc    Assign phlebotomist to booking (admin)
 * @access  Admin
 */
router.put('/:id/assign', protect, adminOnly, async (req, res) => {
    try {
        const { assignedTo, collectorPhone } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.assignedTo = assignedTo;
        booking.collectorPhone = collectorPhone;
        if (booking.status === 'scheduled') {
            booking.status = 'confirmed';
        }

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Phlebotomist assigned successfully',
            data: booking
        });

    } catch (error) {
        console.error('Assign phlebotomist error:', error);
        res.status(500).json({
            success: false,
            message: 'Error assigning phlebotomist'
        });
    }
});

/**
 * @route   PUT /api/bookings/:id/status
 * @desc    Update booking status (admin)
 * @access  Admin
 */
router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status, sampleCollectedAt } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (status) booking.status = status;
        if (sampleCollectedAt) booking.sampleCollectedAt = sampleCollectedAt;

        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });

    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking status'
        });
    }
});

export default router;
