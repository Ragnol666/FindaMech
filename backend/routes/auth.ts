const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const userData: Record<string, any> = {
      name,
      email,
      password,
      role: role || 'user',
      phone
    };

    // Add location for mechanics
    if (role === 'mechanic' && location) {
      userData.location = {
        type: 'Point',
        coordinates: location.coordinates || [0, 0]
      };
      // Store address and city as additional fields if needed
      userData.shopAddress = location.address;
    }

    const user = new User(userData);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.status(201).send({ user, token });
  } catch (e) {
    console.error('Registration error:', e);
    res.status(400).send({ message: (e as Error).message || 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.send({ user, token });
  } catch (e) {
    console.error('Login error:', e);
    res.status(400).send({ message: (e as Error).message || 'Login failed' });
  }
});

// Get profile
router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

// Logout
router.post('/logout', auth, (req, res) => {
  res.send({ message: 'Logged out successfully' });
});

module.exports = router;