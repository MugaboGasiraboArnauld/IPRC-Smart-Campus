const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const moduleSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  description:      { type: String, default: '' },
  department:       { type: String, required: true },
  campus:           { type: String, required: true },
  trainerId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  modules:          [moduleSchema],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  status:           { type: String, enum: ['draft','active','archived'], default: 'draft' },
  coverImage:       { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
