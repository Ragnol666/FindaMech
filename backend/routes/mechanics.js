const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
require('../models/Review'); // Ensure Review model is registered

const router = express.Router();

// Update mechanic profile
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'phone', 'shopAddress'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send(user);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

// Get mechanic profile with services and reviews
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('services')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' }
      });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send(user);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Find mechanics near a location
router.get('/nearby', async (req, res) => {
  try {
    const { lng, lat, maxDistance = 10000 } = req.query; // maxDistance in meters (10km default)

    if (!lng || !lat) {
      return res.status(400).send({ message: 'Longitude and latitude are required' });
    }

    const mechanics = await User.find({
      role: 'mechanic',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
    .populate('services')
    .select('-password');

    res.send(mechanics);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Get all mechanics
router.get('/all', async (req, res) => {
  try {
    const mechanics = await User.find({ role: 'mechanic' })
      .populate('services')
      .select('-password');

    res.send(mechanics);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = router;