const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// register
router.post('/register', [
  body('username').isLength({min:3}),
  body('email').isEmail(),
  body('password').isLength({min:6})
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ message: 'validation failed', details: errors.array() });

  const { username, email, password } = req.body;
  try {
    if(await User.findOne({ $or: [{ email }, { username }] })) {
      return res.status(400).json({ message: 'user already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email }});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'server error' });
  }
});

// login
router.post('/login', [
  body('email').notEmpty(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ message: 'validation failed', details: errors.array() });

  const { email, password } = req.body;
  try {
    // allow login by email or username
    const user = await User.findOne({ $or: [{ email }, { username: email }] });
    if(!user) return res.status(400).json({ message: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({ message: 'invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email }});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;

