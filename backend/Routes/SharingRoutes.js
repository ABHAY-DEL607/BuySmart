const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Sharing = require('../models/SharingModel');

// Create a new share
router.post('/', auth, async (req, res) => {
  try {
    const sharing = new Sharing({
      ...req.body,
      userId: req.user._id
    });
    await sharing.save();
    res.status(201).json(sharing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all public shares
router.get('/public', async (req, res) => {
  try {
    const shares = await Sharing.find({ visibility: 'public' })
      .populate('userId', 'name')
      .populate('productId')
      .sort({ createdAt: -1 });
    res.json(shares);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's shares
router.get('/my-shares', auth, async (req, res) => {
  try {
    const shares = await Sharing.find({ userId: req.user._id })
      .populate('productId')
      .sort({ createdAt: -1 });
    res.json(shares);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get shares shared with the user
router.get('/shared-with-me', auth, async (req, res) => {
  try {
    const shares = await Sharing.find({ 
      sharedWith: req.user._id,
      visibility: 'shared'
    })
    .populate('userId', 'name')
    .populate('productId')
    .sort({ createdAt: -1 });
    res.json(shares);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a share
router.patch('/:id', auth, async (req, res) => {
  try {
    const share = await Sharing.findOne({ 
      _id: req.params.id,
      userId: req.user._id
    });
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }
    Object.assign(share, req.body);
    await share.save();
    res.json(share);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a share
router.delete('/:id', auth, async (req, res) => {
  try {
    const share = await Sharing.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }
    res.json({ message: 'Share deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;