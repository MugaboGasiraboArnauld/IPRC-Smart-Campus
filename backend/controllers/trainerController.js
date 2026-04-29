const Trainer = require('../models/Trainer');
const User = require('../models/User');

exports.getAll = async (req, res) => {
  try {
    const { status, department } = req.query;
    const filter = {};
    if (status === 'approved') filter.approved = true;
    else if (status === 'pending') filter.applicationStatus = 'pending';
    if (department) filter.department = department;
    const trainers = await Trainer.find(filter).populate('userId','name email phone').sort('-createdAt');
    res.json({ success: true, count: trainers.length, data: trainers });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getMy = async (req, res) => {
  try {
    const trainer = await Trainer.findOne({ userId: req.user._id }).populate('assignedCourses');
    res.json({ success: true, data: trainer });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.apply = async (req, res) => {
  try {
    const exists = await Trainer.findOne({ userId: req.user._id });
    if (exists) return res.status(400).json({ message: 'Application already submitted' });
    const trainer = await Trainer.create({ userId: req.user._id, ...req.body });
    res.status(201).json({ success: true, data: trainer });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.approve = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id,
      { applicationStatus: 'approved', approved: true, department: req.body.department || undefined },
      { new: true }).populate('userId','name email');
    await User.findByIdAndUpdate(trainer.userId._id || trainer.userId, { isVerified: true });
    res.json({ success: true, data: trainer });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.reject = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id,
      { applicationStatus: 'rejected', adminNote: req.body.adminNote || '' }, { new: true });
    res.json({ success: true, data: trainer });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.getById = async (req, res) => {
  try {
    const t = await Trainer.findById(req.params.id).populate('userId','name email phone').populate('assignedCourses');
    if (!t) return res.status(404).json({ message: 'Trainer not found' });
    res.json({ success: true, data: t });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
