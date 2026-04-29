// courseRoutes.js
const express = require('express');
const r1 = express.Router();
const mc = require('../controllers/mainController');
const { protect, authorize } = require('../middleware/auth');
r1.get('/', protect, mc.getCourses);
r1.get('/my', protect, authorize('trainer'), mc.getMyCourses);
r1.post('/', protect, authorize('trainer','admin'), mc.createCourse);
r1.put('/:id', protect, authorize('trainer','admin'), mc.updateCourse);
r1.delete('/:id', protect, authorize('trainer','admin'), mc.deleteCourse);
module.exports = r1;
