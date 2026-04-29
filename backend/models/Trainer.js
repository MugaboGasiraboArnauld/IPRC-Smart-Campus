const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  qualification:     { type: String, required: true },
  experience:        { type: Number, required: true },
  department:        { type: String, required: true },
  campus:            { type: String, default: '' },
  specialization:    { type: String, default: '' },
  cv:                { type: String, default: '' },
  certificates:      [String],
  applicationStatus: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  approved:          { type: Boolean, default: false },
  assignedCourses:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  adminNote:         { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Trainer', trainerSchema);
