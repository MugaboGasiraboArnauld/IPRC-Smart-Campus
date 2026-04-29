import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ApplyStudentPage from './pages/public/ApplyStudentPage';
import ApplyTrainerPage from './pages/public/ApplyTrainerPage';
import ProgramsPage from './pages/public/ProgramsPage';
import ContactPage from './pages/public/ContactPage';

// Student pages
import StudentLayout from './components/layout/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentNotes from './pages/student/StudentNotes';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentHostel from './pages/student/StudentHostel';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import StudentProfile from './pages/student/StudentProfile';

// Trainer pages
import TrainerLayout from './components/layout/TrainerLayout';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerCourses from './pages/trainer/TrainerCourses';
import TrainerNotes from './pages/trainer/TrainerNotes';
import TrainerAssignments from './pages/trainer/TrainerAssignments';
import TrainerAttendance from './pages/trainer/TrainerAttendance';
import TrainerAnnouncements from './pages/trainer/TrainerAnnouncements';
import TrainerProfile from './pages/trainer/TrainerProfile';

// Admin pages
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminHostels from './pages/admin/AdminHostels';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminProfile from './pages/admin/AdminProfile';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-iprc-600 border-t-transparent rounded-full animate-spin"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}`} replace /> : <RegisterPage />} />
      <Route path="/apply/student" element={<ApplyStudentPage />} />
      <Route path="/apply/trainer" element={<ApplyTrainerPage />} />
      <Route path="/programs" element={<ProgramsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Student */}
      <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="notes" element={<StudentNotes />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="hostel" element={<StudentHostel />} />
        <Route path="announcements" element={<StudentAnnouncements />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Trainer */}
      <Route path="/trainer" element={<ProtectedRoute roles={['trainer']}><TrainerLayout /></ProtectedRoute>}>
        <Route index element={<TrainerDashboard />} />
        <Route path="courses" element={<TrainerCourses />} />
        <Route path="notes" element={<TrainerNotes />} />
        <Route path="assignments" element={<TrainerAssignments />} />
        <Route path="attendance" element={<TrainerAttendance />} />
        <Route path="announcements" element={<TrainerAnnouncements />} />
        <Route path="profile" element={<TrainerProfile />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="trainers" element={<AdminTrainers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="hostels" element={<AdminHostels />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontFamily: '"DM Sans", sans-serif', fontSize: '14px' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
