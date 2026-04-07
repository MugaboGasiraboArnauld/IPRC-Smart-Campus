const express = require('express');
const r = express.Router();
const mc = require('../controllers/mainController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');
r.get('/:courseId', protect, mc.getNotes);
r.post('/', protect, authorize('trainer','admin'), upload.single('file'), mc.uploadNote);
r.delete('/:id', protect, authorize('trainer','admin'), mc.deleteNote);
module.exports = r;
