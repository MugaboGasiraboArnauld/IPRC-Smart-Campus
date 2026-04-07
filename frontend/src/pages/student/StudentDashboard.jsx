import React, { useEffect, useState } from 'react';
import { getMyStudent, getCourses, getNotes, getAssignments, submitAssignment, getHostels, bookHostel, getAnnouncements, updateProfile } from '../../services/api';
import { StatCard, Badge, Modal, Spinner, EmptyState, FileTypeBadge, FormField, Select } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// ── Student Dashboard ──────────────────────────────────
export function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    Promise.all([getMyStudent(), getAnnouncements()])
      .then(([p,a])=>{ setProfile(p.data.data); setAnns(a.data.data.slice(0,3)); })
      .finally(()=>setLoading(false));
  },[]);
  if(loading) return <div className="flex justify-center py-20"><Spinner size="lg"/></div>;
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <p className="text-xs text-gray-400 mb-1">{new Date().toLocaleDateString('en-RW',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        <h1 className="font-display text-3xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your student overview.</p>
      </div>
      {!profile ? (
        <div className="card p-6 bg-amber-50 border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-2">Complete your application</h3>
          <p className="text-sm text-amber-700 mb-4">You haven't submitted a student application yet.</p>
          <a href="/apply/student" className="btn-primary">Apply Now →</a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Application" value={profile.applicationStatus} icon="📋" color="green"/>
            <StatCard label="Student ID" value={profile.studentId||'Pending'} icon="🪪" color="blue"/>
            <StatCard label="Program" value={profile.program?.split(' ')[0]||'—'} icon="📚" color="amber"/>
            <StatCard label="Campus" value={profile.campus?.replace('IPRC ','')||'—'} icon="🏫" color="purple"/>
          </div>
          {profile.applicationStatus === 'pending' && (
            <div className="card p-5 border border-amber-200 bg-amber-50">
              <p className="font-semibold text-amber-800">⏳ Application under review</p>
              <p className="text-sm text-amber-700 mt-1">Your application is being reviewed by the admin. You'll receive access once approved.</p>
            </div>
          )}
          {profile.applicationStatus === 'approved' && (
            <div className="card p-5 border border-iprc-200 bg-iprc-50">
              <p className="font-semibold text-iprc-800">🎉 Application approved!</p>
              <p className="text-sm text-iprc-700 mt-1">Your Student ID: <strong>{profile.studentId}</strong>. You now have full access to the portal.</p>
            </div>
          )}
        </>
      )}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Announcements</h2>
          <a href="/student/announcements" className="text-xs text-iprc-600 font-medium">View all →</a>
        </div>
        {anns.length===0 ? <p className="text-sm text-gray-400 py-4 text-center">No announcements yet</p> : (
          <div className="space-y-3">
            {anns.map(a=>(
              <div key={a._id} className={`p-4 rounded-xl border ${a.priority==='urgent'?'border-red-200 bg-red-50':'border-gray-100 bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-medium text-sm text-gray-900">{a.title}</p>
                  {a.priority==='urgent' && <span className="badge-red">Urgent</span>}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{a.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="card p-5">
        <h2 className="section-title mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[['📚','My Courses','/student/courses'],['📄','Notes','/student/notes'],['📝','Assignments','/student/assignments'],['🏨','Hostel','/student/hostel']].map(([icon,label,href])=>(
            <a key={label} href={href} className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-iprc-50 border border-gray-100 hover:border-iprc-200 rounded-xl transition-all text-center">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Student Courses ────────────────────────────────────
export function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ getCourses({ status:'active' }).then(r=>setCourses(r.data.data)).finally(()=>setLoading(false)); },[]);
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Available Courses</h1>
      {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.length===0 && <EmptyState icon="📚" title="No courses available" message="Check back later."/>}
          {courses.map(c=>(
            <div key={c._id} className="card p-5 hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-iprc-50 rounded-xl flex items-center justify-center font-display font-bold text-iprc-800 text-sm mb-4">{c.title.slice(0,2).toUpperCase()}</div>
              <h3 className="font-display font-semibold text-gray-900 mb-1">{c.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{c.department} · {c.campus}</p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{c.description||'No description provided.'}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                <span>{c.modules?.length||0} modules</span>
                <Badge status={c.status}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Student Notes ──────────────────────────────────────
export function StudentNotes() {
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(()=>{ getCourses({status:'active'}).then(r=>{ setCourses(r.data.data); if(r.data.data.length>0) setSelected(r.data.data[0]._id); }); },[]);
  useEffect(()=>{ if(selected){ setLoading(true); getNotes(selected).then(r=>setNotes(r.data.data)).finally(()=>setLoading(false)); } },[selected]);
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Notes & Materials</h1>
      <div className="card p-4">
        <label className="label">Select Course</label>
        <select className="input" value={selected} onChange={e=>setSelected(e.target.value)}>
          {courses.map(c=><option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>
      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : notes.length===0 ? (
          <EmptyState icon="📄" title="No notes yet" message="Your trainer hasn't uploaded materials for this course yet."/>
        ) : (
          <div className="divide-y divide-gray-50">
            {notes.map(n=>(
              <div key={n._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${n.fileType==='pdf'?'bg-red-50':n.fileType==='video'?'bg-purple-50':'bg-blue-50'}`}>
                  {n.fileType==='pdf'?'📄':n.fileType==='video'?'🎬':'📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{n.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FileTypeBadge type={n.fileType}/>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <a href={`http://localhost:5000${n.fileUrl}`} target="_blank" rel="noreferrer" className="btn-primary btn-sm">⬇ Download</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Student Assignments ────────────────────────────────
export function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [file, setFile] = useState(null);
  useEffect(()=>{ getAssignments().then(r=>setAssignments(r.data.data)).finally(()=>setLoading(false)); },[]);
  const handleSubmit = async (id) => {
    if(!file) { toast.error('Please select a file'); return; }
    const fd = new FormData(); fd.append('file', file);
    try { await submitAssignment(id, fd); toast.success('Assignment submitted!'); setSubmitting(null); setFile(null); }
    catch(err) { toast.error(err.response?.data?.message||'Failed'); }
  };
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Assignments</h1>
      {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : (
        <div className="space-y-4">
          {assignments.length===0 && <EmptyState icon="📝" title="No assignments" message="No assignments have been posted yet."/>}
          {assignments.map(a=>{
            const due = new Date(a.dueDate);
            const overdue = due < new Date();
            return (
              <div key={a._id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{a.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{a.description}</p>
                    <div className="flex gap-4 text-xs flex-wrap">
                      <span className={overdue?'text-red-500 font-medium':'text-gray-500'}>📅 Due: {due.toLocaleDateString()}{overdue?' (Overdue)':''}</span>
                      <span className="text-gray-500">📊 {a.totalMarks} marks</span>
                      <span className="text-gray-500">📚 {a.courseId?.title}</span>
                    </div>
                  </div>
                  <button onClick={()=>setSubmitting(a._id)} className="btn-primary btn-sm flex-shrink-0">Submit</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal open={!!submitting} onClose={()=>{ setSubmitting(null); setFile(null); }} title="Submit Assignment" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Upload your work</label>
            <input type="file" onChange={e=>setFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:bg-gray-50 hover:file:bg-iprc-50 file:text-gray-700"/>
          </div>
          <div className="flex gap-3"><button onClick={()=>{ setSubmitting(null); setFile(null); }} className="btn-secondary flex-1 justify-center">Cancel</button><button onClick={()=>handleSubmit(submitting)} className="btn-primary flex-1 justify-center">Submit</button></div>
        </div>
      </Modal>
    </div>
  );
}

// ── Student Hostel ─────────────────────────────────────
export function StudentHostel() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({ roomNumber:'', semester:'Semester 1', academicYear:'2024-2025', amount:0 });
  const set = k => v => setForm(f=>({...f,[k]:v}));
  useEffect(()=>{ getHostels().then(r=>setHostels(r.data.data)).finally(()=>setLoading(false)); },[]);
  const handleBook = async (e) => {
    e.preventDefault();
    try { await bookHostel({ hostelId: booking._id, ...form }); toast.success('Booking submitted!'); setBooking(null); }
    catch(err) { toast.error(err.response?.data?.message||'Booking failed'); }
  };
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Hostel Booking</h1>
      {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hostels.length===0 && <EmptyState icon="🏨" title="No hostels available" message="No hostels listed yet."/>}
          {hostels.map(h=>(
            <div key={h._id} className="card p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-semibold text-gray-900">{h.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{h.campus} · {h.location}</p>
                </div>
                <Badge status={h.gender}/>
              </div>
              {h.facilities?.length>0 && (
                <div className="flex flex-wrap gap-1 mb-4">{h.facilities.map(f=><span key={f} className="badge-gray text-xs">{f}</span>)}</div>
              )}
              <div className="space-y-2 mb-4">
                {h.rooms?.slice(0,3).map(r=>(
                  <div key={r.roomNumber} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-gray-700">{r.roomNumber} — {r.type}</span>
                    <span className="text-gray-500">{r.capacity} beds · {r.available} avail</span>
                    <span className="font-semibold text-iprc-700">{r.price?.toLocaleString()} RWF</span>
                  </div>
                ))}
              </div>
              <button onClick={()=>{ setBooking(h); setForm({roomNumber:h.rooms?.[0]?.roomNumber||'',semester:'Semester 1',academicYear:'2024-2025',amount:h.rooms?.[0]?.price||0}); }} className="btn-primary w-full justify-center">Book a Room</button>
            </div>
          ))}
        </div>
      )}
      <Modal open={!!booking} onClose={()=>setBooking(null)} title={`Book Room — ${booking?.name}`} size="md">
        {booking && (
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="label">Select Room</label>
              <select className="input" value={form.roomNumber} onChange={e=>{ const r=booking.rooms.find(x=>x.roomNumber===e.target.value); set('roomNumber')(e.target.value); set('amount')(r?.price||0); }}>
                {booking.rooms?.map(r=><option key={r.roomNumber} value={r.roomNumber}>{r.roomNumber} — {r.type} — {r.price?.toLocaleString()} RWF</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Semester" value={form.semester} onChange={set('semester')} options={['Semester 1','Semester 2']}/>
              <FormField label="Academic Year" value={form.academicYear} onChange={set('academicYear')} placeholder="2024-2025"/>
            </div>
            <div className="bg-iprc-50 rounded-xl p-4">
              <p className="text-xs text-iprc-700 mb-1">Total Amount</p>
              <p className="font-display font-bold text-2xl text-iprc-800">{form.amount?.toLocaleString()} RWF</p>
            </div>
            <div className="flex gap-3"><button type="button" onClick={()=>setBooking(null)} className="btn-secondary flex-1 justify-center">Cancel</button><button type="submit" className="btn-primary flex-1 justify-center">Confirm Booking</button></div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// ── Student Announcements ─────────────────────────────
export function StudentAnnouncements() {
  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ getAnnouncements().then(r=>setAnns(r.data.data)).finally(()=>setLoading(false)); },[]);
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Announcements</h1>
      {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : (
        <div className="space-y-4">
          {anns.length===0 && <EmptyState icon="📢" title="No announcements" message="Nothing posted yet."/>}
          {anns.map(a=>(
            <div key={a._id} className={`card p-5 border-l-4 ${a.priority==='urgent'?'border-l-red-400':'border-l-iprc-400'}`}>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                {a.priority==='urgent' && <span className="badge-red">Urgent</span>}
                <span className="badge-gray capitalize">{a.target}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{a.message}</p>
              <p className="text-xs text-gray-400 mt-3">Posted by {a.postedBy?.name} · {new Date(a.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Student Profile ────────────────────────────────────
export function StudentProfile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: user?.name||'', phone: user?.phone||'' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  useEffect(()=>{ getMyStudent().then(r=>setProfile(r.data.data)); },[]);
  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const res = await updateProfile(form); setUser(res.data.user); localStorage.setItem('iprc_user',JSON.stringify(res.data.user)); toast.success('Profile updated!'); }
    catch { toast.error('Failed'); } finally { setLoading(false); }
  };
  return (
    <div className="animate-fade-in max-w-lg space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">My Profile</h1>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-iprc-50 rounded-full flex items-center justify-center font-display font-bold text-iprc-800 text-2xl">{(user?.name||'S').split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div><p className="font-semibold text-gray-900 text-lg">{user?.name}</p><p className="text-sm text-gray-500">{user?.email}</p>{profile?.studentId && <p className="text-xs font-mono text-iprc-600 mt-0.5">{profile.studentId}</p>}</div>
        </div>
        {profile && (
          <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4 text-sm mb-5">
            {[['Program',profile.program],['Campus',profile.campus],['Status',profile.applicationStatus],['Confirmed',profile.confirmed?'Yes':'No']].map(([l,v])=>(
              <div key={l}><p className="text-xs text-gray-400 mb-0.5">{l}</p><p className="font-medium text-gray-800 capitalize">{v}</p></div>
            ))}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={set('name')} required/></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={set('phone')}/></div>
          <div><label className="label">Email</label><input className="input bg-gray-50 text-gray-400 cursor-not-allowed" value={user?.email} disabled/></div>
          <button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}

export default StudentDashboard;
