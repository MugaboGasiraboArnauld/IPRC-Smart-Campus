const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/students',      require('./routes/studentRoutes'));
app.use('/api/trainers',      require('./routes/trainerRoutes'));
app.use('/api/courses',       require('./routes/courseRoutes'));
app.use('/api/notes',         require('./routes/noteRoutes'));
app.use('/api/assignments',   require('./routes/assignmentRoutes'));
app.use('/api/attendance',    require('./routes/attendanceRoutes'));
app.use('/api/hostels',       require('./routes/hostelRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/dashboard',     require('./routes/dashboardRoutes'));

app.get('/', (_req, res) => res.json({ message: 'IPRC Smart Campus API v1.0' }));

// 404
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 IPRC API running on port ${PORT}`));
