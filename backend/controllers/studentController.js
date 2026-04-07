const Student = require('../models/Student');
const User = require('../models/User');

// GET /api/students  (admin)
exports.getAll = async (req, res) => {
  try {
    const { status, campus, search } = req.query;
    const filter = {};
    if (status) filter.applicationStatus = status;
    if (campus) filter.campus = campus;
    let students = await Student.find(filter).populate('userId', 'name email phone createdAt').sort('-createdAt');
    if (search) {
      const s = search.toLowerCase();
      students = students.filter(st => st.userId?.name?.toLowerCase().includes(s) || st.userId?.email?.toLowerCase().includes(s) || st.studentId?.toLowerCase().includes(s));
    }
    res.json({ success: true, count: students.length, data: students });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// GET /api/students/my  (student)
exports.getMy = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate('enrolledCourses').populate('hostelBooking');
    res.json({ success: true, data: student });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// POST /api/students/apply
exports.apply = async (req, res) => {
  try {
    const exists = await Student.findOne({ userId: req.user._id });
    if (exists) return res.status(400).json({ message: 'Application already submitted' });
    const student = await Student.create({ userId: req.user._id, ...req.body });
    res.status(201).json({ success: true, data: student });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PUT /api/students/:id/approve
exports.approve = async (req, res) => {
  try {
    const { adminNote } = req.body;
    const count = await Student.countDocuments({ applicationStatus: 'approved' });
    const studentId = `IPRC-2024-${String(count + 1).padStart(3, '0')}`;
    const student = await Student.findByIdAndUpdate(req.params.id,
      { applicationStatus: 'approved', confirmed: true, studentId, adminNote: adminNote || '' },
      { new: true }).populate('userId','name email phone');
    // Also update user isVerified
    await User.findByIdAndUpdate(student.userId._id || student.userId, { isVerified: true });
    res.json({ success: true, data: student });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PUT /api/students/:id/reject
exports.reject = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id,
      { applicationStatus: 'rejected', adminNote: req.body.adminNote || '' }, { new: true });
    res.json({ success: true, data: student });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// GET /api/students/:id
exports.getById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('userId','name email phone').populate('enrolledCourses');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
