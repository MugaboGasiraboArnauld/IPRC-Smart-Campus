const mongoose = require('mongoose');

// ── Note ──────────────────────────────────────────────
const noteSchema = new mongoose.Schema({
  courseId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title:      { type: String, required: true },
  description:{ type: String, default: '' },
  fileUrl:    { type: String, required: true },
  fileType:   { type: String, enum: ['pdf','docx','pptx','video','zip','other'], default: 'other' },
  fileSize:   { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  downloads:  { type: Number, default: 0 },
}, { timestamps: true });
exports.Note = mongoose.model('Note', noteSchema);

// ── Hostel ────────────────────────────────────────────
const roomSchema = new mongoose.Schema({
  roomNumber: String, type: { type: String, enum: ['single','double','shared'] },
  capacity: Number, available: Number, price: Number,
});
const hostelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  campus: { type: String, required: true },
  location: String, description: String,
  gender: { type: String, enum: ['male','female','mixed'], required: true },
  facilities: [String], images: [String], rooms: [roomSchema],
}, { timestamps: true });
exports.Hostel = mongoose.model('Hostel', hostelSchema);

// ── Booking ───────────────────────────────────────────
const bookingSchema = new mongoose.Schema({
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  hostelId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  roomNumber:    { type: String, required: true },
  semester:      String, academicYear: String,
  status:        { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid','partial','paid'], default: 'unpaid' },
  amount:        Number,
}, { timestamps: true });
exports.Booking = mongoose.model('Booking', bookingSchema);

// ── Attendance ────────────────────────────────────────
const attendanceSchema = new mongoose.Schema({
  courseId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:      { type: Date, required: true, default: Date.now },
  records:   [{ studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, status: { type: String, enum: ['present','absent','late'] } }],
}, { timestamps: true });
exports.Attendance = mongoose.model('Attendance', attendanceSchema);

// ── Assignment ────────────────────────────────────────
const assignmentSchema = new mongoose.Schema({
  courseId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  trainerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:      { type: String, required: true },
  description:String, fileUrl: String,
  dueDate:    { type: Date, required: true },
  totalMarks: { type: Number, default: 100 },
  submissions:[{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    fileUrl: String, submittedAt: { type: Date, default: Date.now },
    grade: Number, feedback: String,
    status: { type: String, enum: ['submitted','graded','late'], default: 'submitted' },
  }],
}, { timestamps: true });
exports.Assignment = mongoose.model('Assignment', assignmentSchema);

// ── Announcement ──────────────────────────────────────
const announcementSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  message:   { type: String, required: true },
  postedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target:    { type: String, enum: ['all','students','trainers','department'], default: 'all' },
  department:String, campus: String,
  priority:  { type: String, enum: ['normal','urgent'], default: 'normal' },
}, { timestamps: true });
exports.Announcement = mongoose.model('Announcement', announcementSchema);
