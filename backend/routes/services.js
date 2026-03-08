const express = require('express');
const Service = require('../models/Service');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all services for a mechanic
router.get('/', auth, async (req, res) => {
  try {
    const services = await Service.find({ mechanic: req.user._id });
    res.send(services);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

// Add a new service
router.post('/', auth, async (req, res) => {
  try {
    const service = new Service({
      ...req.body,
      mechanic: req.user._id
    });
    await service.save();

    // Add service to mechanic's services array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { services: service._id }
    });

    res.status(201).send(service);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

// Update a service
router.put('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, mechanic: req.user._id },
      req.body,
      { new: true }
    );
    if (!service) {
      return res.status(404).send({ message: 'Service not found' });
    }
    res.send(service);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

// Delete a service
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      mechanic: req.user._id
    });
    if (!service) {
      return res.status(404).send({ message: 'Service not found' });
    }
    res.send({ message: 'Service deleted successfully' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = router;