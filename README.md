# IPRC Smart Campus & E-Learning Management System

A full-stack web application for all IPRC colleges in Rwanda.

## Tech Stack
- **Frontend:** React.js 18 + Tailwind CSS + React Router v6
- **Backend:** Node.js + Express.js + JWT Auth
- **Database:** MongoDB + Mongoose
- **File Uploads:** Multer

## Quick Start

### Prerequisites
- Node.js >= 16
- MongoDB running locally or Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Default Ports
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Test Credentials (after seeding)
- Admin:   admin@iprc.ac.rw / admin123
- Trainer: trainer@iprc.ac.rw / trainer123
- Student: student@iprc.ac.rw / student123

## Features
- Role-based auth (Student / Trainer / Admin)
- Online student applications & admissions
- Hostel booking with room selection
- E-learning: notes, video links, assignments
- Trainer job applications
- Attendance tracking
- Announcements system
- Multi-campus support (Kigali, Huye, Ngoma, Gishari, Musanze, Karongi)
- Fully responsive (mobile, tablet, desktop)