const express = require('express');
const r = express.Router();
const mc = require('../controllers/mainController');
const { protect, authorize } = require('../middleware/auth');
r.get('/:courseId', protect, mc.getAttendance);
r.post('/', protect, authorize('trainer','admin'), mc.saveAttendance);
module.exports = r;
