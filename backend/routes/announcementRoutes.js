// announcementRoutes.js
const express = require('express');
const r1 = express.Router();
const mc = require('../controllers/mainController');
const { protect, authorize } = require('../middleware/auth');
r1.get('/', protect, mc.getAnnouncements);
r1.post('/', protect, authorize('admin','trainer'), mc.createAnnouncement);
r1.delete('/:id', protect, authorize('admin'), mc.deleteAnnouncement);
module.exports = r1;
