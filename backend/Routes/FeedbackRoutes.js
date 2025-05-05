const express = require('express');
const router = express.Router();
const Feedback = require('../models/FeedbackModel');

// Create new feedback
router.post('/add', async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        const savedFeedback = await feedback.save();
        res.status(201).json({
            status: 'success',
            data: savedFeedback
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get all feedback
router.get('/getall', async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            data: feedback
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get feedback by ID
router.get('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({
                status: 'error',
                message: 'Feedback not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: feedback
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update feedback status
router.patch('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!feedback) {
            return res.status(404).json({
                status: 'error',
                message: 'Feedback not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: feedback
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Delete feedback
router.delete('/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({
                status: 'error',
                message: 'Feedback not found'
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Feedback deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = router;