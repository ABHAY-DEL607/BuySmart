const express = require('express');
const router = express.Router();
const Notification = require('../models/NotificationModel');
const auth = require('../middleware/auth');

// Create a new notification
router.post('/', auth, async (req, res) => {
    try {
        const notification = new Notification({
            userId: req.user._id,
            title: req.body.title,
            message: req.body.message,
            type: req.body.type,
            status: 'unread'
        });

        const savedNotification = await notification.save();
        res.status(201).json({
            status: 'success',
            data: savedNotification
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get all notifications for a user
router.get('/user', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            data: notifications
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { status: 'read' },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                status: 'error',
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: notification
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Delete a notification
router.delete('/:id', auth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!notification) {
            return res.status(404).json({
                status: 'error',
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;