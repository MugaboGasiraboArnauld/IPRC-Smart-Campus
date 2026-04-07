const express = require('express');
const r = express.Router();
const mc = require('../controllers/mainController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');
r.get('/', protect, mc.getAssignments);
r.post('/', protect, authorize('trainer','admin'), upload.single('file'), mc.createAssignment);
r.post('/:id/submit', protect, authorize('student'), upload.single('file'), mc.submitAssignment);
module.exports = r;
