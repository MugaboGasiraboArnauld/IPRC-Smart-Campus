const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Student = require('../models/Student');
const Trainer = require('../models/Trainer');
const Course = require('../models/Course');
const Hostel = require('../models/Hostel');
const Announcement = require('../models/Announcement');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User, Student, Trainer, Course, Hostel, Announcement].map(M => M.deleteMany({})));

  // Admin
  const admin = await User.create({ name: 'IPRC Admin', email: 'admin@iprc.ac.rw', password: 'admin123', role: 'admin', phone: '+250788000001', isVerified: true });

  // Trainer
  const trainerUser = await User.create({ name: 'Jean Mutabazi', email: 'trainer@iprc.ac.rw', password: 'trainer123', role: 'trainer', phone: '+250788000002', isVerified: true });
  const trainer = await Trainer.create({ userId: trainerUser._id, qualification: 'MSc Computer Science', experience: 5, department: 'ICT', campus: 'IPRC Kigali', applicationStatus: 'approved', approved: true });

  // Student
  const studentUser = await User.create({ name: 'Alice Uwase', email: 'student@iprc.ac.rw', password: 'student123', role: 'student', phone: '+250788000003', isVerified: true });
  await Student.create({ userId: studentUser._id, nationalId: '1200180012345678', program: 'Software Development', campus: 'IPRC Kigali', applicationStatus: 'approved', confirmed: true, studentId: 'IPRC-2024-001' });

  // Courses
  const c1 = await Course.create({ title: 'Database Systems', description: 'Learn SQL, MongoDB and database design.', department: 'ICT', campus: 'IPRC Kigali', trainerId: trainer._id, status: 'active', modules: [{ title: 'Introduction to Databases', lessons: [{ title: 'What is a Database?', order: 1 }, { title: 'RDBMS vs NoSQL', order: 2 }] }, { title: 'SQL Fundamentals', lessons: [{ title: 'SELECT Queries', order: 1 }, { title: 'JOINs', order: 2 }] }] });
  await Course.create({ title: 'Web Development II', description: 'Advanced React, Node.js and REST APIs.', department: 'ICT', campus: 'IPRC Kigali', trainerId: trainer._id, status: 'active', modules: [{ title: 'React Advanced', lessons: [{ title: 'Hooks Deep Dive', order: 1 }] }] });

  // Hostels
  await Hostel.create({ name: 'Green Valley Hostel', campus: 'IPRC Kigali', location: 'Block A, Kigali Campus', gender: 'male', facilities: ['WiFi', 'Study Room', 'Laundry'], images: [], rooms: [{ roomNumber: 'A101', type: 'single', capacity: 1, available: 1, price: 150000 }, { roomNumber: 'A102', type: 'double', capacity: 2, available: 2, price: 100000 }, { roomNumber: 'A103', type: 'shared', capacity: 4, available: 3, price: 70000 }] });
  await Hostel.create({ name: 'Sunrise Residence', campus: 'IPRC Kigali', location: 'Block B, Kigali Campus', gender: 'female', facilities: ['WiFi', 'Security', 'Common Room'], images: [], rooms: [{ roomNumber: 'B101', type: 'single', capacity: 1, available: 1, price: 160000 }, { roomNumber: 'B102', type: 'double', capacity: 2, available: 1, price: 110000 }] });

  // Announcements
  await Announcement.create({ title: 'Semester 1 Registration Open', message: 'All students are required to complete course registration by January 31st. Log in to your student portal to register for your courses.', postedBy: admin._id, target: 'students', priority: 'urgent', campus: 'IPRC Kigali' });
  await Announcement.create({ title: 'Welcome Back - New Academic Year', message: 'We welcome all students and staff to the new academic year 2024-2025. Please attend the orientation session on Monday.', postedBy: admin._id, target: 'all', priority: 'normal' });

  console.log('✅ Database seeded successfully!');
  console.log('Admin:   admin@iprc.ac.rw / admin123');
  console.log('Trainer: trainer@iprc.ac.rw / trainer123');
  console.log('Student: student@iprc.ac.rw / student123');
  process.exit(0);
};

seed().catch(e => { console.error(e); process.exit(1); });
