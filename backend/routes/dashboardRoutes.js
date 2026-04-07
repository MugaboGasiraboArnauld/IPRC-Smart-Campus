const express = require('express');
const r = express.Router();
const mc = require('../controllers/mainController');
const { protect, authorize } = require('../middleware/auth');
r.get('/admin', protect, authorize('admin'), mc.adminStats);
r.get('/trainer', protect, authorize('trainer'), mc.trainerStats);
module.exports = r;
