const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nationalId:        { type: String, required: true, unique: true },
  program:           { type: String, required: true },
  campus:            { type: String, required: true, enum: ['IPRC Kigali','IPRC Huye','IPRC Ngoma','IPRC Gishari','IPRC Musanze','IPRC Karongi'] },
  applicationStatus: { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  confirmed:         { type: Boolean, default: false },
  studentId:         { type: String, unique: true, sparse: true },
  documents: { certificate: { type: String, default: '' }, photo: { type: String, default: '' } },
  enrolledCourses:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  hostelBooking:     { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  adminNote:         { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
