import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, getAnnouncements, getStudents } from '../../services/api';
import { StatCard, Spinner, Badge } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getStudents({ status: 'pending' }), getAnnouncements()])
      .then(([s, st, an]) => {
        setStats(s.data.data);
        setRecent(st.data.data.slice(0, 5));
        setAnnouncements(an.data.data.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="page-header">
        <p className="text-xs text-gray-400 mb-1">{new Date().toLocaleDateString('en-RW', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        <h1 className="font-display text-3xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening across all campuses today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats?.students ?? 0} icon="🎓" color="green" sub={`${stats?.pending ?? 0} pending`} />
        <StatCard label="Active Trainers" value={stats?.trainers ?? 0} icon="👨‍🏫" color="amber" sub={`${stats?.trainerPending ?? 0} applications`} />
        <StatCard label="Active Courses" value={stats?.courses ?? 0} icon="📚" color="blue" />
        <StatCard label="Hostel Bookings" value={stats?.bookings ?? 0} icon="🏨" color="purple" />
      </div>

      {/* Alerts */}
      {(stats?.pending > 0 || stats?.trainerPending > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats?.pending > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div><p className="font-semibold text-amber-800 text-sm">{stats.pending} student application{stats.pending>1?'s':''} pending</p><p className="text-xs text-amber-600 mt-0.5">Requires your review</p></div>
              <Link to="/admin/students" className="btn-primary btn-sm bg-amber-600 border-amber-600 hover:bg-amber-700">Review</Link>
            </div>
          )}
          {stats?.trainerPending > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
              <div><p className="font-semibold text-blue-800 text-sm">{stats.trainerPending} trainer application{stats.trainerPending>1?'s':''} pending</p><p className="text-xs text-blue-600 mt-0.5">Requires your review</p></div>
              <Link to="/admin/trainers" className="btn-primary btn-sm bg-blue-600 border-blue-600 hover:bg-blue-700">Review</Link>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Applications</h2>
            <Link to="/admin/students" className="text-xs text-iprc-600 hover:text-iprc-800 font-medium">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No pending applications</p>
          ) : (
            <div className="space-y-3">
              {recent.map(s => (
                <div key={s._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-iprc-50/50 transition-colors">
                  <div className="w-9 h-9 bg-iprc-50 rounded-full flex items-center justify-center font-semibold text-iprc-800 text-sm flex-shrink-0">
                    {(s.userId?.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.userId?.name}</p>
                    <p className="text-xs text-gray-500">{s.program} · {s.campus}</p>
                  </div>
                  <Badge status={s.applicationStatus} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Announcements</h2>
            <Link to="/admin/announcements" className="text-xs text-iprc-600 hover:text-iprc-800 font-medium">Manage →</Link>
          </div>
          {announcements.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No announcements</p>
          ) : (
            <div className="space-y-3">
              {announcements.map(a => (
                <div key={a._id} className="p-3 border border-gray-100 rounded-xl">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 leading-tight">{a.title}</p>
                    {a.priority === 'urgent' && <span className="badge-red flex-shrink-0">Urgent</span>}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
          <Link to="/admin/announcements" className="btn-primary btn-sm w-full justify-center mt-4">+ New Announcement</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label:'Review Students', icon:'🎓', to:'/admin/students' },
            { label:'Manage Trainers', icon:'👨‍🏫', to:'/admin/trainers' },
            { label:'Add Hostel', icon:'🏨', to:'/admin/hostels' },
            { label:'Post Announcement', icon:'📢', to:'/admin/announcements' },
          ].map(q => (
            <Link key={q.label} to={q.to} className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-iprc-50 border border-gray-100 hover:border-iprc-200 rounded-xl transition-all text-center">
              <span className="text-2xl">{q.icon}</span>
              <span className="text-xs font-medium text-gray-700">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
