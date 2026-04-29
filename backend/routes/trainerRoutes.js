const express = require('express');
const r = express.Router();
const c = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

r.get('/',            protect, authorize('admin'), c.getAll);
r.get('/my',          protect, authorize('trainer'), c.getMy);
r.get('/:id',         protect, c.getById);
r.post('/apply',      protect, upload.fields([{name:'cv',maxCount:1},{name:'certificates',maxCount:5}]), c.apply);
r.put('/:id/approve', protect, authorize('admin'), c.approve);
r.put('/:id/reject',  protect, authorize('admin'), c.reject);
module.exports = r;
