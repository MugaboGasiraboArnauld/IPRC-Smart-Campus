const Course = require('../models/Course');
const { Note, Hostel, Booking, Attendance, Assignment, Announcement } = require('../models/index');
const Trainer = require('../models/Trainer');
const Student = require('../models/Student');

// ── COURSES ───────────────────────────────────────────
exports.getCourses = async (req, res) => {
  try {
    const filter = {};
    if (req.query.campus) filter.campus = req.query.campus;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.status) filter.status = req.query.status;
    const courses = await Course.find(filter).populate('trainerId','userId').sort('-createdAt');
    res.json({ success: true, data: courses });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getMyCourses = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) return res.status(404).json({ message: 'Trainer profile not found' });
    const courses = await Course.find({ trainerId: trainer._id });
    res.json({ success: true, data: courses });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createCourse = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user._id });
    const course = await Course.create({ ...req.body, trainerId: trainer._id });
    res.status(201).json({ success: true, data: course });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: course });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── NOTES ─────────────────────────────────────────────
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ courseId: req.params.courseId }).populate('uploadedBy','name').sort('-createdAt');
    res.json({ success: true, data: notes });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.uploadNote = async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl;
    const ext = (req.file?.originalname || '').split('.').pop().toLowerCase();
    const typeMap = { pdf:'pdf', doc:'docx', docx:'docx', ppt:'pptx', pptx:'pptx', mp4:'video', zip:'zip' };
    const note = await Note.create({ ...req.body, fileUrl, fileType: typeMap[ext] || 'other', fileSize: req.file?.size || 0, uploadedBy: req.user._id });
    res.status(201).json({ success: true, data: note });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Note deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── HOSTELS ───────────────────────────────────────────
exports.getHostels = async (req, res) => {
  try {
    const filter = {};
    if (req.query.campus) filter.campus = req.query.campus;
    if (req.query.gender) filter.gender = req.query.gender;
    const hostels = await Hostel.find(filter);
    res.json({ success: true, data: hostels });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createHostel = async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);
    res.status(201).json({ success: true, data: hostel });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: hostel });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteHostel = async (req, res) => {
  try {
    await Hostel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Hostel deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.bookHostel = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    const { hostelId, roomNumber, semester, academicYear, amount } = req.body;
    const booking = await Booking.create({ studentId: student._id, hostelId, roomNumber, semester, academicYear, amount });
    await Student.findByIdAndUpdate(student._id, { hostelBooking: booking._id });
    res.status(201).json({ success: true, data: booking });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate({ path:'studentId', populate:{ path:'userId', select:'name email' } }).populate('hostelId','name campus').sort('-createdAt');
    res.json({ success: true, data: bookings });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── ANNOUNCEMENTS ─────────────────────────────────────
exports.getAnnouncements = async (req, res) => {
  try {
    const filter = {};
    if (req.query.target) filter.target = req.query.target;
    const ann = await Announcement.find(filter).populate('postedBy','name').sort('-createdAt');
    res.json({ success: true, data: ann });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ success: true, data: ann });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── ATTENDANCE ────────────────────────────────────────
exports.saveAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body;
    let att = await Attendance.findOne({ courseId, date: { $gte: new Date(date).setHours(0,0,0,0), $lt: new Date(date).setHours(23,59,59,999) } });
    if (att) { att.records = records; await att.save(); }
    else att = await Attendance.create({ courseId, trainerId: req.user._id, date, records });
    res.json({ success: true, data: att });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ courseId: req.params.courseId }).sort('-date');
    res.json({ success: true, data: records });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── ASSIGNMENTS ───────────────────────────────────────
exports.getAssignments = async (req, res) => {
  try {
    const filter = req.query.courseId ? { courseId: req.query.courseId } : {};
    const assignments = await Assignment.find(filter).populate('courseId','title').sort('-createdAt');
    res.json({ success: true, data: assignments });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.createAssignment = async (req, res) => {
  try {
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const a = await Assignment.create({ ...req.body, fileUrl, trainerId: req.user._id });
    res.status(201).json({ success: true, data: a });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.submitAssignment = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : '';
    const assignment = await Assignment.findByIdAndUpdate(req.params.id,
      { $push: { submissions: { studentId: student._id, fileUrl, status: 'submitted' } } }, { new: true });
    res.json({ success: true, data: assignment });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// ── DASHBOARD ─────────────────────────────────────────
exports.adminStats = async (req, res) => {
  try {
    const [students, trainers, courses, hostels, announcements, bookings] = await Promise.all([
      Student.countDocuments(), Trainer.countDocuments({ approved: true }),
      Course.countDocuments({ status: 'active' }), Hostel.countDocuments(),
      Announcement.countDocuments(), Booking.countDocuments(),
    ]);
    const pending = await Student.countDocuments({ applicationStatus: 'pending' });
    const trainerPending = await Trainer.countDocuments({ applicationStatus: 'pending' });
    res.json({ success: true, data: { students, trainers, courses, hostels, announcements, bookings, pending, trainerPending } });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.trainerStats = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer) return res.json({ success: true, data: {} });
    const courses = await Course.find({ trainerId: trainer._id });
    const courseIds = courses.map(c => c._id);
    const notes = await Note.countDocuments({ courseId: { $in: courseIds } });
    const assignments = await Assignment.countDocuments({ courseId: { $in: courseIds } });
    const totalStudents = courses.reduce((s, c) => s + c.enrolledStudents.length, 0);
    res.json({ success: true, data: { courses: courses.length, notes, assignments, students: totalStudents } });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
