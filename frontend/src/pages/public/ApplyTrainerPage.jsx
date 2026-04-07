import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { applyTrainer } from '../../services/api';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import { Spinner } from '../../components/common';

const departments = ['ICT','Electronics','Electrical','Civil Engineering','Mechanical','Hospitality','Accounting','Agriculture'];

// ── Apply Trainer ─────────────────────────────────────
export function ApplyTrainerPage() {
  const [form, setForm] = useState({ qualification:'', experience:'', department:'', specialization:'' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      await applyTrainer(fd);
      toast.success('Trainer application submitted!');
    } catch(err) { toast.error(err.response?.data?.message || 'Submission failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Trainer Application</h1>
          <p className="text-gray-500">Join IPRC as a trainer and shape the next generation</p>
        </div>
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Highest Qualification *</label><input className="input" value={form.qualification} onChange={set('qualification')} placeholder="e.g. MSc Computer Science" required /></div>
            <div><label className="label">Years of Experience *</label><input className="input" type="number" min="0" value={form.experience} onChange={set('experience')} required /></div>
            <div>
              <label className="label">Department *</label>
              <select className="input" value={form.department} onChange={set('department')} required>
                <option value="">Select department</option>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div><label className="label">Specialization</label><input className="input" value={form.specialization} onChange={set('specialization')} placeholder="e.g. Web Development, Networking" /></div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3"><p className="text-xs text-amber-800">Please <Link to="/register" className="font-semibold underline">create an account</Link> or <Link to="/login" className="font-semibold underline">sign in</Link> before submitting.</p></div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <><Spinner size="sm"/><span>Submitting...</span></> : '👨‍🏫 Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Programs ──────────────────────────────────────────
const programs = [
  { dept:'ICT', icon:'💻', list:['Software Development','Network & System Administration','Computer Hardware'] },
  { dept:'Electronics', icon:'⚡', list:['Electronics & Telecommunication','Electrical Installation'] },
  { dept:'Civil Engineering', icon:'🏗️', list:['Construction Technology','Land Surveying','Plumbing & Sanitation'] },
  { dept:'Hospitality', icon:'🍽️', list:['Food & Beverage','Accommodation','Tour Guiding'] },
  { dept:'Business', icon:'📊', list:['Accounting & Finance','Marketing','Business Management'] },
];

export function ProgramsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">Programs Offered</h1>
          <p className="text-gray-500 max-w-xl mx-auto">IPRC offers a wide range of technical and vocational programs across all campuses.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map(p => (
            <div key={p.dept} className="card p-6 hover:shadow-md transition-all">
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="font-display font-semibold text-gray-900 text-lg mb-3">{p.dept}</h3>
              <ul className="space-y-2">{p.list.map(l => <li key={l} className="text-sm text-gray-600 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-iprc-400 rounded-full flex-shrink-0"/>{l}</li>)}</ul>
              <Link to="/apply/student" className="btn-primary btn-sm mt-5 inline-flex">Apply Now</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Contact ───────────────────────────────────────────
export function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-500">Reach out to any of our campus offices</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[['IPRC Kigali','KK 15 Rd, Kigali','+250 788 100 001','kigali@iprc.ac.rw'],
            ['IPRC Huye','Butare, Southern Province','+250 788 100 002','huye@iprc.ac.rw'],
            ['IPRC Ngoma','Ngoma, Eastern Province','+250 788 100 003','ngoma@iprc.ac.rw'],
            ['IPRC Musanze','Musanze, Northern Province','+250 788 100 004','musanze@iprc.ac.rw'],
          ].map(([name,addr,phone,email]) => (
            <div key={name} className="card p-6">
              <h3 className="font-display font-semibold text-gray-900 mb-4">{name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📍 {addr}</p><p>📞 {phone}</p><p>✉️ {email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ApplyTrainerPage;
