import React, { useEffect, useState } from 'react';
import { getCourses, createCourse, deleteCourse, getHostels, createHostel, deleteHostel, getAnnouncements, createAnnouncement, deleteAnnouncement, updateProfile } from '../../services/api';
import { Badge, Modal, Spinner, EmptyState, FormField, Select, ConfirmDialog } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const campuses = ['IPRC Kigali','IPRC Huye','IPRC Ngoma','IPRC Gishari','IPRC Musanze','IPRC Karongi'];
const departments = ['ICT','Electronics','Electrical','Civil Engineering','Mechanical','Hospitality','Accounting','Agriculture'];

// ── Admin Courses ─────────────────────────────────────
export function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', department:'', campus:'', status:'active' });
  const set = k => v => setForm(f => ({...f,[k]:v}));

  const load = async () => { setLoading(true); try { const r = await getCourses(); setCourses(r.data.data); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await createCourse(form); toast.success('Course created!'); setShowAdd(false); setForm({ title:'',description:'',department:'',campus:'',status:'active' }); load(); }
    catch(err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleDelete = async (id) => {
    try { await deleteCourse(id); toast.success('Course deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-900">Courses</h1><p className="text-sm text-gray-500">{courses.length} total courses</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">+ New Course</button>
      </div>
      <div className="card overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> :
         courses.length === 0 ? <EmptyState icon="📚" title="No courses yet" message="Create the first course." action={<button onClick={() => setShowAdd(true)} className="btn-primary">Add Course</button>} /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Title','Department','Campus','Students','Status','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.title}</td>
                    <td className="px-4 py-3 text-gray-600">{c.department}</td>
                    <td className="px-4 py-3 text-gray-600">{c.campus}</td>
                    <td className="px-4 py-3 text-gray-600">{c.enrolledStudents?.length || 0}</td>
                    <td className="px-4 py-3"><Badge status={c.status}/></td>
                    <td className="px-4 py-3"><button onClick={() => handleDelete(c._id)} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create Course" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Course Title" value={form.title} onChange={set('title')} required placeholder="e.g. Database Systems"/>
          <FormField label="Description" type="textarea" value={form.description} onChange={set('description')} placeholder="Brief description..."/>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Department" value={form.department} onChange={set('department')} options={departments} required/>
            <Select label="Campus" value={form.campus} onChange={set('campus')} options={campuses} required/>
          </div>
          <Select label="Status" value={form.status} onChange={set('status')} options={['draft','active','archived']}/>
          <div className="flex gap-3 pt-2"><button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1 justify-center">Cancel</button><button type="submit" className="btn-primary flex-1 justify-center">Create Course</button></div>
        </form>
      </Modal>
    </div>
  );
}

// ── Admin Hostels ─────────────────────────────────────
export function AdminHostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', campus:'', location:'', gender:'male', facilities:'' });
  const set = k => v => setForm(f => ({...f,[k]:v}));

  const load = async () => { setLoading(true); try { const r = await getHostels(); setHostels(r.data.data); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createHostel({ ...form, facilities: form.facilities.split(',').map(s=>s.trim()).filter(Boolean) });
      toast.success('Hostel added!'); setShowAdd(false); setForm({ name:'',campus:'',location:'',gender:'male',facilities:'' }); load();
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); }
  };
  const handleDelete = async (id) => { try { await deleteHostel(id); toast.success('Hostel removed'); load(); } catch { toast.error('Failed'); } };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-900">Hostels</h1><p className="text-sm text-gray-500">{hostels.length} hostels</p></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">+ Add Hostel</button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hostels.map(h => (
            <div key={h._id} className="card p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-semibold text-gray-900">{h.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{h.campus}</p>
                </div>
                <Badge status={h.gender}/>
              </div>
              <p className="text-sm text-gray-600 mb-3">📍 {h.location}</p>
              <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
                <span className="text-gray-500">{h.rooms?.length || 0} room types</span>
                <div className="flex gap-2">
                  <button onClick={() => handleDelete(h._id)} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50">Delete</button>
                </div>
              </div>
              {h.facilities?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {h.facilities.map(f => <span key={f} className="badge-gray text-xs">{f}</span>)}
                </div>
              )}
            </div>
          ))}
          {hostels.length === 0 && <EmptyState icon="🏨" title="No hostels yet" message="Add the first hostel." />}
        </div>
      )}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Hostel" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Hostel Name" value={form.name} onChange={set('name')} required placeholder="e.g. Green Valley Hostel"/>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Campus" value={form.campus} onChange={set('campus')} options={campuses} required/>
            <Select label="Gender" value={form.gender} onChange={set('gender')} options={['male','female','mixed']}/>
          </div>
          <FormField label="Location" value={form.location} onChange={set('location')} placeholder="Block A, Kigali Campus"/>
          <FormField label="Facilities (comma separated)" value={form.facilities} onChange={set('facilities')} placeholder="WiFi, Study Room, Laundry"/>
          <div className="flex gap-3 pt-2"><button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1 justify-center">Cancel</button><button type="submit" className="btn-primary flex-1 justify-center">Add Hostel</button></div>
        </form>
      </Modal>
    </div>
  );
}

// ── Admin Announcements ───────────────────────────────
export function AdminAnnouncements() {
  const [anns, setAnns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ title:'', message:'', target:'all', priority:'normal' });
  const set = k => v => setForm(f => ({...f,[k]:v}));

  const load = async () => { setLoading(true); try { const r = await getAnnouncements(); setAnns(r.data.data); } finally { setLoading(false); } };
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await createAnnouncement(form); toast.success('Announcement posted!'); setShowAdd(false); setForm({ title:'',message:'',target:'all',priority:'normal' }); load(); }
    catch(err) { toast.error(err.response?.data?.message||'Failed'); }
  };
  const handleDelete = async (id) => { try { await deleteAnnouncement(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); } };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-2xl font-bold text-gray-900">Announcements</h1></div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">+ Post Announcement</button>
      </div>
      {loading ? <div className="flex justify-center py-16"><Spinner size="lg"/></div> : (
        <div className="space-y-4">
          {anns.length === 0 && <EmptyState icon="📢" title="No announcements" message="Post the first announcement." action={<button onClick={()=>setShowAdd(true)} className="btn-primary">Post Now</button>}/>}
          {anns.map(a => (
            <div key={a._id} className={`card p-5 border-l-4 ${a.priority==='urgent'?'border-l-red-400':'border-l-iprc-400'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    {a.priority==='urgent' && <span className="badge-red">Urgent</span>}
                    <span className="badge-gray capitalize">{a.target}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{a.message}</p>
                  <p className="text-xs text-gray-400 mt-2">Posted by {a.postedBy?.name} · {new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setDeleteId(a._id)} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 flex-shrink-0">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)} title="Delete Announcement" message="This cannot be undone." danger/>
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Post Announcement" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Title" value={form.title} onChange={set('title')} required placeholder="Announcement title"/>
          <FormField label="Message" type="textarea" value={form.message} onChange={set('message')} required rows={4} placeholder="Write your announcement..."/>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Target Audience" value={form.target} onChange={set('target')} options={[{value:'all',label:'Everyone'},{value:'students',label:'Students'},{value:'trainers',label:'Trainers'}]}/>
            <Select label="Priority" value={form.priority} onChange={set('priority')} options={['normal','urgent']}/>
          </div>
          <div className="flex gap-3 pt-2"><button type="button" onClick={() => setShowAdd(false)} className="btn-secondary flex-1 justify-center">Cancel</button><button type="submit" className="btn-primary flex-1 justify-center">Post</button></div>
        </form>
      </Modal>
    </div>
  );
}

// ── Admin Profile ─────────────────────────────────────
export function AdminProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const res = await updateProfile(form); setUser(res.data.user); localStorage.setItem('iprc_user',JSON.stringify(res.data.user)); toast.success('Profile updated!'); }
    catch { toast.error('Failed to update'); }
    finally { setLoading(false); }
  };
  return (
    <div className="animate-fade-in max-w-lg space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">My Profile</h1>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-iprc-50 rounded-full flex items-center justify-center font-display font-bold text-iprc-800 text-2xl">
            {(user?.name||'A').split(' ').map(w=>w[0]).join('').slice(0,2)}
          </div>
          <div><p className="font-semibold text-gray-900 text-lg">{user?.name}</p><p className="text-sm text-gray-500 capitalize">{user?.role} · {user?.email}</p></div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={set('name')} required/></div>
          <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={set('phone')} placeholder="+250 7XX XXX XXX"/></div>
          <div><label className="label">Email</label><input className="input" value={user?.email} disabled className="input bg-gray-50 text-gray-400 cursor-not-allowed"/></div>
          <button type="submit" disabled={loading} className="btn-primary">{loading?'Saving...':'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}

export default AdminCourses;
