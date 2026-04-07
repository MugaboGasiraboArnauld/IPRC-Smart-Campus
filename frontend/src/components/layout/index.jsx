import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const studentLinks = [
  { items: [
    { path: '/student', end: true, icon: '🏠', label: 'Dashboard' },
    { path: '/student/courses',       icon: '📚', label: 'My Courses' },
    { path: '/student/notes',         icon: '📄', label: 'Notes & Materials' },
    { path: '/student/assignments',   icon: '📝', label: 'Assignments' },
    { path: '/student/hostel',        icon: '🏨', label: 'Hostel Booking' },
    { path: '/student/announcements', icon: '📢', label: 'Announcements' },
  ]},
  { label: 'Account', items: [
    { path: '/student/profile', icon: '👤', label: 'My Profile' },
  ]},
];

const trainerLinks = [
  { items: [
    { path: '/trainer', end: true, icon: '🏠', label: 'Dashboard' },
    { path: '/trainer/courses',       icon: '📚', label: 'My Courses' },
    { path: '/trainer/notes',         icon: '📤', label: 'Upload Notes' },
    { path: '/trainer/assignments',   icon: '📝', label: 'Assignments' },
    { path: '/trainer/attendance',    icon: '✅', label: 'Attendance' },
    { path: '/trainer/announcements', icon: '📢', label: 'Announcements' },
  ]},
  { label: 'Account', items: [
    { path: '/trainer/profile', icon: '👤', label: 'My Profile' },
  ]},
];

const adminLinks = [
  { items: [
    { path: '/admin', end: true, icon: '🏠', label: 'Dashboard' },
    { path: '/admin/students',      icon: '🎓', label: 'Students' },
    { path: '/admin/trainers',      icon: '👨‍🏫', label: 'Trainers' },
    { path: '/admin/courses',       icon: '📚', label: 'Courses' },
    { path: '/admin/hostels',       icon: '🏨', label: 'Hostels' },
    { path: '/admin/announcements', icon: '📢', label: 'Announcements' },
  ]},
  { label: 'Account', items: [
    { path: '/admin/profile', icon: '👤', label: 'Profile' },
  ]},
];

const Shell = ({ links }) => (
  <div className="flex h-screen bg-gray-50 overflow-hidden">
    <Sidebar links={links} />
    <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
        <Outlet />
      </div>
    </main>
  </div>
);

export const StudentLayout = () => <Shell links={studentLinks} />;
export const TrainerLayout = () => <Shell links={trainerLinks} />;
export const AdminLayout   = () => <Shell links={adminLinks} />;

export default Shell;
