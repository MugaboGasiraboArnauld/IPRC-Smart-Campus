import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { applyStudent } from '../../services/api';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import { Spinner } from '../../components/common';

const campuses = ['IPRC Kigali','IPRC Huye','IPRC Ngoma','IPRC Gishari','IPRC Musanze','IPRC Karongi'];
const programs = ['Software Development','Network & System Administration','Electronics & Telecommunication','Electrical Engineering','Civil Engineering','Mechanical Engineering','Hospitality & Tourism','Accounting & Finance','Agriculture'];

export default function ApplyStudentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nationalId:'', program:'', campus:'', certificate:'', photo:'' });
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please register/login first'); navigate('/register'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k,v));
      await applyStudent(fd);
      toast.success('Application submitted successfully!');
      navigate('/student');
    } catch(err) { toast.error(err.response?.data?.message || 'Submission failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">Student Application</h1>
          <p className="text-gray-500">Apply to join IPRC — it only takes a few minutes</p>
        </div>
        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1,2,3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${step >= s ? 'bg-iprc-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
              {s < 3 && <div className={`w-16 h-0.5 transition-all ${step > s ? 'bg-iprc-600' : 'bg-gray-200'}`} />}
            </React.Fragment>
          ))}
        </div>
        <div className="card p-6 sm:p-8">
          {!user && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800">You need an account to apply. <Link to="/register" className="font-semibold underline">Register first</Link> or <Link to="/login" className="font-semibold underline">sign in</Link>.</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <div className="space-y-4 animate-slide-up">
                <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Personal Information</h2>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Name from your account</p>
                  <p className="font-medium text-gray-800">{user?.name || '—'}</p>
                </div>
                <div><label className="label">National ID *</label><input className="input" value={form.nationalId} onChange={set('nationalId')} placeholder="1200180012345678" required /></div>
                <button type="button" onClick={() => setStep(2)} className="btn-primary w-full justify-center py-3">Continue →</button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4 animate-slide-up">
                <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Academic Details</h2>
                <div>
                  <label className="label">Program *</label>
                  <select className="input" value={form.program} onChange={set('program')} required>
                    <option value="">Select a program</option>
                    {programs.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Campus *</label>
                  <select className="input" value={form.campus} onChange={set('campus')} required>
                    <option value="">Select campus</option>
                    {campuses.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">← Back</button>
                  <button type="button" onClick={() => setStep(3)} disabled={!form.program||!form.campus} className="btn-primary flex-1 justify-center">Continue →</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4 animate-slide-up">
                <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Review & Submit</h2>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  {[['Name',user?.name],['National ID',form.nationalId],['Program',form.program],['Campus',form.campus]].map(([l,v])=>(
                    <div key={l} className="flex justify-between"><span className="text-gray-500">{l}</span><span className="font-medium text-gray-900">{v||'—'}</span></div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">By submitting, you confirm that all information is accurate. Admin will review and approve your application.</p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center">← Back</button>
                  <button type="submit" disabled={loading||!user} className="btn-primary flex-1 justify-center">
                    {loading ? <><Spinner size="sm" /><span>Submitting...</span></> : '🎓 Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
