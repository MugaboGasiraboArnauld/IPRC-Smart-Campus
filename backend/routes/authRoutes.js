// routes/authRoutes.js
const express = require('express');
const r = express.Router();
const c = require('../controllers/authController');
const { protect } = require('../middleware/auth');
r.post('/register', c.register);
r.post('/login', c.login);
r.get('/me', protect, c.getMe);
r.put('/update', protect, c.updateProfile);
module.exports = r;
