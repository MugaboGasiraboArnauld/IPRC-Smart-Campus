import React, { useEffect, useState } from 'react';
import { getMyCourses, getTrainerStats, createCourse, updateCourse, deleteCourse, getNotes, uploadNote, deleteNote, getAssignments, createAssignment, getAttendance, saveAttendance, getAnnouncements, createAnnouncement, updateProfile } from '../../services/api';
import { StatCard, Badge, Modal, Spinner, EmptyState, FormField, Select, FileTypeBadge, Avatar } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const campuses = ['IPRC Kigali','IPRC Huye','IPRC Ngoma','IPRC Gishari','IPRC Musanze','IPRC Karongi'];
const departments = ['ICT','Electronics','Electrical','Civil Engineering','Mechanical','Hospitality','Accounting','Agriculture'];

// ── Trainer Dashboard ──────────────────────────────────
export function TrainerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getTrainerStats(), getMyCourses()])
      .then(([s,c]) => { setStats(s.data.data); setCourses(c.data.data.slice(0,4)); })
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg"/></div>;
  return (
    <div className="animate-fade-in space-y-6">
      <div><p className="text-xs text-gray-400 mb-1">{new Date().toLocaleDateString('en-RW',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        <h1 className="font-display text-3xl font-bold text-gray-900">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your teaching overview.</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Courses" value={stats?.courses??0} icon="📚" color="green"/>
        <StatCard label="Total Students" value={stats?.students??0} icon="🎓" color="amber"/>
        <StatCard label="Notes Uploaded" value={stats?.notes??0} icon="📄" color="blue"/>
        <StatCard label="Assignments" value={stats?.assignments??0} icon="📝" color="purple"/>
      </div>
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">My Courses</h2>
          <a href="/trainer/courses" className="text-xs text-iprc-600 font-medium">View all →</a>
        </div>
        {courses.length===0 ? <EmptyState icon="📚" title="No courses yet" message="Create your first course."/> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map(c=>(
              <div key={c._id} className="bg-gray-50 rounded-xl p-4 hover:bg-iprc-50/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">{c.title}</h3>
                  <Badge status={c.status}/>
                </div>
                <p className="text-xs text-gray-500">{c.department} · {c.campus}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>{c.modules?.length||0} modules</span>
                  <span>{c.enrolledStudents?.length||0} students</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Trainer Courses ────────────────────────────────────
export function TrainerCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', department:'', campus:'', status:'draft' });
  const set = k => v => setForm(f => ({...f,[k]:v}));
  const load = async () => { setLoading(true); try { const r = await getMyCourses(); setCourses(r.data.data); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const handleCreate = async (e) => {
    e.preventDefault();
    try { await createCourse(form); toast.success('Course created!'); setShowAdd(false); setForm({title:'',description:'',department:'',campus:'',status:'draft'}); load(); }
    catch(err) { toast.error(err.response?.data?.message||'Failed'); }
  };
  const handleDelete = async (id) => { try { await deleteCourse(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } };
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-900">My Courses</h1><p className="text-sm text-gray-500">{courses.length} courses</p></div>
        <button onClick={()=>setShowAdd(true)} className="btn-primary">+ New Course</button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.length===0 && <EmptyState icon="📚" title="No courses yet" message="Create your first course." action={<button onClick={()=>setShowAdd(true)} className="btn-primary">Create Course</button>}/>}
          {courses.map(c=>(
            <div key={c._id} className="card p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-iprc-50 rounded-xl flex items-center justify-center font-display font-bold text-iprc-800 text-sm flex-shrink-0">{c.title.slice(0,2).toUpperCase()}</div>
                <Badge status={c.status}/>
              </div>
              <h3 className="font-display font-semibold text-gray-900 mb-1">{c.title}</h3>
              <p className="text-xs text-gray-500 mb-3">{c.department} · {c.campus}</p>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">{c.description||'No description'}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                <span>{c.modules?.length||0} modules · {c.enrolledStudents?.length||0} students</span>
                <button onClick={()=>handleDelete(c._id)} className="text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Create Course" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Course Title" value={form.title} onChange={set('title')} required placeholder="e.g. Database Systems"/>
          <FormField label="Description" type="textarea" value={form.description} onChange={set('description')} placeholder="Brief course description..."/>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Department" value={form.department} onChange={set('department')} options={departments} required/>
            <Select label="Campus" value={form.campus} onChange={set('campus')} options={campuses} required/>
          </div>
          <Select label="Status" value={form.status} onChange={set('status')} options={['draft','active']}/>
          <div className="flex gap-3 pt-2"><button type="button" onClick={()=>setShowAdd(false)} className="btn-secondary flex-1 justify-center">Cancel</button><button type="submit" className="btn-primary flex-1 justify-center">Create</button></div>
        </form>
      </Modal>
    </div>
  );
}

// ── Trainer Notes ──────────────────────────────────────
export function TrainerNotes() {
  const [courses, setCourses] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', fileType:'pdf' });
  const set = k => v => setForm(f=>({...f,[k]:v}));

  useEffect(()=>{ getMyCourses().then(r=>{ setCourses(r.data.data); if(r.data.data.length>0) setSelectedCourse(r.data.data[0]._id); }); },[]);
  useEffect(()=>{ if(selectedCourse){ setLoading(true); getNotes(selectedCourse).then(r=>setNotes(r.data.data)).finally(()=>setLoading(false)); } },[selectedCourse]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k,v])=>fd.append(k,v));
    fd.append('courseId', selectedCourse);
    if(file) fd.append('file', file);
    try { await uploadNote(fd); toast.success('Note uploaded!'); setShowUpload(false); setFile(null); setForm({title:'',description:'',fileType:'pdf'}); getNotes(selectedCourse).then(r=>setNotes(r.data.data)); }
    catch(err) { toast.error(err.response?.data?.message||'Upload failed'); }
  };
  const handleDelete = async (id) => { try { await deleteNote(id); toast.success('Deleted'); setNotes(n=>n.filter(x=>x._id!==id)); } catch { toast.error('Failed'); } };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-900">Notes & Materials</h1></div>
        <button onClick={()=>setShowUpload(true)} className="btn-primary">+ Upload Note</button>
      </div>
      <div className="card p-4">
        <label className="label">Select Course</label>
        <select className="input" value={selectedCourse} onChange={e=>setSelectedCourse(e.target.value)}>
          {courses.map(c=><option key={c._id} value={c._id}>{c.title}</option>)}
        </select>
      </div>
      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : notes.length===0 ? (
          <EmptyState icon="📄" title="No notes uploaded" message="Upload your first course material." action={<button onClick={()=>setShowUpload(true)} className="btn-primary">Upload Now</button>}/>
        ) : (
          <div className="divide-y divide-gray-50">
            {notes.map(n=>(
              <div key={n._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${n.fileType==='pdf'?'bg-red-50':n.fileType==='video'?'bg-purple-50':n.fileType==='pptx'?'bg-orange-50':'bg-blue-50'}`}>
                  {n.fileType==='pdf'?'📄':n.fileType==='video'?'🎬':n.fileType==='pptx'?'📊':'📝'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{n.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FileTypeBadge type={n.fileType}/>
                    <span className="text-xs text-gray-400">{n.downloads} downloads · {new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`http://localhost:5000${n.fileUrl}`} target="_blank" rel="noreferrer" className="btn-secondary btn-sm">Download</a>
                  <button onClick={()=>handleDelete(n._id)} className="btn-sm text-xs text-red-500 border border-red-200 hover:bg-red-50 rounded-lg px-3 py-1.5">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal open={showUpload} onClose={()=>setShowUpload(false)} title="Upload Material" size="md">
        <form onSubmit={handleUpload} className="space-y-4">
          <FormField label="Title" value={form.title} onChange={set('title')} required placeholder="e.g. Week 6 — SQL Joins"/>
          <FormField label="Description" type="textarea" value={form.description} onChange={set('description')} placeholder="Optional description..."/>
          <Select label="File Type" value={form.fileType} onChange={set('fileType')} options={['pdf','docx','pptx','video','zip','other']}/>
          <div>
            <label className="label">File</label>
            <input type="file" onChange={e=>setFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:bg-gray-50 hover:file:bg-iprc-50 file:text-gray-700"/>
          </div>
          <div className="flex gap-3 pt-2"><button type="button" onClick={()=>setShowUpload(false)} className="btn-secondary flex-1 justify-center">Cancel</button><button type="submit" className="btn-primary flex-1 justify-center">Upload</button></div>
        </form>
      </Modal>
    </div>
  );
}

// ── Trainer Assignments ────────────────────────────────
export function TrainerAssignments() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', courseId:'', dueDate:'', totalMarks:100 });
  const set = k => v => setForm(f=>({...f,[k]:v}));
  useEffect(()=>{ Promise.all([getMyCourses(),getAssignments()]).then(([c,a])=>{ setCourses(c.data.data); setAssignments(a.data.data); }).finally(()=>setLoading(false)); },[]);
  const handleCreate = async (e) => {
    e.preventDefault(); const fd = new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,v));
    try { await createAssignment(fd); toast.success('Assignment created!'); setShowAdd(false); setForm({title:'',description:'',courseId:'',dueDate:'',totalMarks:100}); const r = await getAssignments(); setAssignments(r.data.data); }
    catch(err) { toast.error(err.response?.data?.message||'Failed'); }
  };
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-900">Assignments</h1></div>
        <button onClick={()=>setShowAdd(true)} className="btn-primary">+ New Assignment</button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : (
        <div className="space-y-4">
          {assignments.length===0 && <EmptyState icon="📝" title="No assignments yet" message="Create your first assignment." action={<button onClick={()=>setShowAdd(true)} className="btn-primary">Create</button>}/>}
          {assignments.map(a=>(
            <div key={a._id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{a.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{a.description}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>📅 Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                    <span>📊 {a.totalMarks} marks</span>
                    <span>📤 {a.submissions?.length||0} submissions</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="New Assignment" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Title" value={form.title} onChange={set('title')} required placeholder="Assignment title"/>
          <FormField label="Description" type="textarea" value={form.description} onChange={set('description')} placeholder="Instructions..."/>
          <Select label="Course" value={form.courseId} onChange={set('courseId')} options={courses.map(c=>({value:c._id,label:c.title}))} required/>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Due Date" type="date" value={form.dueDate} onChange={set('dueDate')} required/>
            <FormField label="Total Marks" type="number" value={form.totalMarks} onChange={set('totalMarks')}/>
          </div>
          <div className="flex gap-3 pt-2"><button type="button" onClick={()=>setShowAdd(false)} className="btn-secondary flex-1 justify-center">Cancel</button><button type="submit" className="btn-primary flex-1 justify-center">Create</button></div>
        </form>
      </Modal>
    </div>
  );
}

// ── Trainer Attendance ─────────────────────────────────
export function TrainerAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const mockStudents = [
    {id:'s1',name:'Alice Uwase'},{id:'s2',name:'Bruno Nkusi'},{id:'s3',name:'Claire Ingabire'},
    {id:'s4',name:'David Habimana'},{id:'s5',name:'Eve Muhoza'},{id:'s6',name:'Frank Bizimana'},
  ];
  const [attendance, setAttendance] = useState(() => Object.fromEntries(mockStudents.map(s=>[s.id,'present'])));

  useEffect(()=>{ getMyCourses().then(r=>{ setCourses(r.data.data); if(r.data.data.length>0) setSelectedCourse(r.data.data[0]._id); }); },[]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const rec = mockStudents.map(s=>({ studentId: s.id, status: attendance[s.id] }));
      await saveAttendance({ courseId: selectedCourse, date, records: rec });
      toast.success('Attendance saved!');
    } catch(err) { toast.error(err.response?.data?.message||'Failed to save'); }
    finally { setSaving(false); }
  };

  const counts = { present: mockStudents.filter(s=>attendance[s.id]==='present').length, absent: mockStudents.filter(s=>attendance[s.id]==='absent').length, late: mockStudents.filter(s=>attendance[s.id]==='late').length };

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Attendance</h1>
      <div className="card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Course</label>
          <select className="input" value={selectedCourse} onChange={e=>setSelectedCourse(e.target.value)}>
            {courses.map(c=><option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>
        <div><label className="label">Date</label><input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
        <div className="flex items-end"><button onClick={handleSave} disabled={saving} className="btn-primary w-full justify-center">{saving?'Saving...':'💾 Save Attendance'}</button></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center"><div className="text-2xl font-display font-bold text-iprc-600">{counts.present}</div><div className="text-xs text-gray-500 mt-1">Present</div></div>
        <div className="card p-4 text-center"><div className="text-2xl font-display font-bold text-red-500">{counts.absent}</div><div className="text-xs text-gray-500 mt-1">Absent</div></div>
        <div className="card p-4 text-center"><div className="text-2xl font-display font-bold text-amber-500">{counts.late}</div><div className="text-xs text-gray-500 mt-1">Late</div></div>
      </div>
      <div className="card overflow-hidden">
        <div className="divide-y divide-gray-50">
          {mockStudents.map(s=>(
            <div key={s.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <Avatar name={s.name} size="sm"/>
              <span className="flex-1 text-sm font-medium text-gray-900">{s.name}</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                {['present','late','absent'].map(status=>(
                  <button key={status} onClick={()=>setAttendance(a=>({...a,[s.id]:status}))}
                    className={`px-3 py-1.5 text-xs font-medium border-r last:border-r-0 border-gray-200 transition-all capitalize
                      ${attendance[s.id]===status
                        ? status==='present'?'bg-iprc-600 text-white':status==='late'?'bg-amber-500 text-white':'bg-red-500 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Trainer Announcements ─────────────────────────────
export function TrainerAnnouncements() {
  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:'', message:'', target:'students', priority:'normal' });
  const set = k => v => setForm(f=>({...f,[k]:v}));
  const load = async () => { setLoading(true); try { const r = await getAnnouncements(); setAnns(r.data.data); } finally { setLoading(false); } };
  useEffect(()=>{ load(); },[]);
  const handleCreate = async (e) => {
    e.preventDefault();
    try { await createAnnouncement(form); toast.success('Posted!'); setShowAdd(false); setForm({title:'',message:'',target:'students',priority:'normal'}); load(); }
    catch(err) { toast.error(err.response?.data?.message||'Failed'); }
  };
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-900">Announcements</h1>
        <button onClick={()=>setShowAdd(true)} className="btn-primary">+ Post</button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : (
        <div className="space-y-4">
          {anns.length===0 && <EmptyState icon="📢" title="No announcements" message="Post something for your students."/>}
          {anns.map(a=>(
            <div key={a._id} className={`card p-5 border-l-4 ${a.priority==='urgent'?'border-l-red-400':'border-l-iprc-400'}`}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-gray-900">{a.title}</h3>
                {a.priority==='urgent' && <span className="badge-red">Urgent</span>}
                <span className="badge-gray capitalize">{a.target}</span>
              </div>
              <p className="text-sm text-gray-600">{a.message}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(a.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Post Announcement" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Title" value={form.title} onChange={set('title')} required placeholder="Announcement title"/>
          <FormField label="Message" type="textarea" value={form.message} onChange={set('message')} required rows={4}/>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Target" value={form.target} onChange={set('target')} options={[{value:'students',label:'My Students'},{value:'all',label:'Everyone'}]}/>
            <Select label="Priority" value={form.priority} onChange={set('priority')} options={['normal','urgent']}/>
          </div>
          <div className="flex gap-3 pt-2"><button type="button" onClick={()=>setShowAdd(false)} className="btn-secondary flex-1 justify-center">Cancel</button><button type="submit" className="btn-primary flex-1 justify-center">Post</button></div>
        </form>
      </Modal>
    </div>
  );
}

// ── Trainer Profile ────────────────────────────────────
export function TrainerProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name||'', phone: user?.phone||'' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
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
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center font-display font-bold text-amber-800 text-2xl">{(user?.name||'T').split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div><p className="font-semibold text-gray-900 text-lg">{user?.name}</p><p className="text-sm text-gray-500 capitalize">{user?.role} · {user?.email}</p></div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={set('name')} required/></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={set('phone')} placeholder="+250 7XX XXX XXX"/></div>
          <div><label className="label">Email</label><input className="input bg-gray-50 text-gray-400 cursor-not-allowed" value={user?.email} disabled/></div>
          <button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}

export default TrainerDashboard;
