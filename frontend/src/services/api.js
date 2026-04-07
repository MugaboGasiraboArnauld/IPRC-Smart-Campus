import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('iprc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('iprc_token');
      localStorage.removeItem('iprc_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/update', data);

// Students
export const getStudents = (params) => API.get('/students', { params });
export const getMyStudent = () => API.get('/students/my');
export const applyStudent = (data) => API.post('/students/apply', data);
export const approveStudent = (id, data) => API.put(`/students/${id}/approve`, data);
export const rejectStudent = (id, data) => API.put(`/students/${id}/reject`, data);
export const getStudentById = (id) => API.get(`/students/${id}`);

// Trainers
export const getTrainers = (params) => API.get('/trainers', { params });
export const getMyTrainer = () => API.get('/trainers/my');
export const applyTrainer = (data) => API.post('/trainers/apply', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const approveTrainer = (id, data) => API.put(`/trainers/${id}/approve`, data);
export const rejectTrainer = (id, data) => API.put(`/trainers/${id}/reject`, data);

// Courses
export const getCourses = (params) => API.get('/courses', { params });
export const getMyCourses = () => API.get('/courses/my');
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

// Notes
export const getNotes = (courseId) => API.get(`/notes/${courseId}`);
export const uploadNote = (data) => API.post('/notes', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteNote = (id) => API.delete(`/notes/${id}`);

// Assignments
export const getAssignments = (params) => API.get('/assignments', { params });
export const createAssignment = (data) => API.post('/assignments', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const submitAssignment = (id, data) => API.post(`/assignments/${id}/submit`, data, { headers: { 'Content-Type': 'multipart/form-data' } });

// Attendance
export const getAttendance = (courseId) => API.get(`/attendance/${courseId}`);
export const saveAttendance = (data) => API.post('/attendance', data);

// Hostels
export const getHostels = (params) => API.get('/hostels', { params });
export const createHostel = (data) => API.post('/hostels', data);
export const updateHostel = (id, data) => API.put(`/hostels/${id}`, data);
export const deleteHostel = (id) => API.delete(`/hostels/${id}`);
export const bookHostel = (data) => API.post('/hostels/book', data);
export const getBookings = () => API.get('/hostels/bookings/all');

// Announcements
export const getAnnouncements = (params) => API.get('/announcements', { params });
export const createAnnouncement = (data) => API.post('/announcements', data);
export const deleteAnnouncement = (id) => API.delete(`/announcements/${id}`);

// Dashboard
export const getAdminStats = () => API.get('/dashboard/admin');
export const getTrainerStats = () => API.get('/dashboard/trainer');

export default API;
