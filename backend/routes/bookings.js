const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new booking (for customers)
router.post('/', auth, async (req, res) => {
  try {
    const { mechanicId, serviceId, date, notes } = req.body;

    const booking = new Booking({
      user: req.user._id,
      mechanic: mechanicId,
      service: serviceId,
      date: new Date(date),
      status: 'pending',
      notes
    });

    await booking.save();
    await booking.populate('user', 'name phone');
    await booking.populate('mechanic', 'name phone shopAddress');
    await booking.populate('service', 'name price');

    res.status(201).send(booking);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

// Get all bookings for the authenticated user.  
// Mechanics receive bookings assigned to them.  
// Customers receive bookings they created.
router.get('/', auth, async (req, res) => {
  try {
    let query;
    if (req.user.role === 'mechanic') {
      query = { mechanic: req.user._id };
    } else {
      query = { user: req.user._id };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name phone')
      .populate('mechanic', 'name phone shopAddress')
      .populate('service', 'name price')
      .sort({ createdAt: -1 });
    res.send(bookings);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Update booking status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, paymentReference, paymentStatus } = req.body;
    let query;

    // Mechanics can update bookings assigned to them
    // Customers can update their own bookings
    if (req.user.role === 'mechanic') {
      query = { _id: req.params.id, mechanic: req.user._id };
    } else {
      query = { _id: req.params.id, user: req.user._id };
    }

    const updateData = { status };
    if (paymentReference) {
      updateData.paymentReference = paymentReference;
    }
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const booking = await Booking.findOneAndUpdate(
      query,
      updateData,
      { new: true }
    ).populate('user', 'name phone').populate('service', 'name price');

    if (!booking) {
      return res.status(404).send({ message: 'Booking not found' });
    }
    res.send(booking);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      mechanic: req.user._id
    }).populate('user', 'name phone email').populate('service');

    if (!booking) {
      return res.status(404).send({ message: 'Booking not found' });
    }
    res.send(booking);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = router;