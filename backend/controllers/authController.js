const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar },
  });
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role: role || 'student', phone });
    sendToken(user, 201, res);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    // Attach profile id
    let profileId = null;
    if (user.role === 'student') {
      const s = await Student.findOne({ userId: user._id });
      profileId = s?._id || null;
    } else if (user.role === 'trainer') {
      const t = await Trainer.findOne({ userId: user._id });
      profileId = t?._id || null;
    }
    const token = signToken(user._id);
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar, profileId } });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;
    if (user.role === 'student') profile = await Student.findOne({ userId: user._id }).populate('enrolledCourses');
    else if (user.role === 'trainer') profile = await Trainer.findOne({ userId: user._id });
    res.json({ success: true, user, profile });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

// PUT /api/auth/update
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true });
    res.json({ success: true, user });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
