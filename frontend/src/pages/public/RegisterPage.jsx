// RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/common';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { const user = await register({...form,role:'student'}); toast.success('Account created!'); navigate('/student'); }
    catch(err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-iprc-50/50 via-white to-amber-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-iprc-600 rounded-xl flex items-center justify-center"><svg className="w-5 h-5 fill-none stroke-white stroke-2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg></div>
            <span className="font-display font-bold text-gray-900 text-lg">IPRC Campus</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Create account</h1>
          <p className="text-gray-500 text-sm">Register to start your application</p>
        </div>
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Full name *</label><input className="input" value={form.name} onChange={set('name')} placeholder="Your full name" required /></div>
            <div><label className="label">Email *</label><input className="input" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required /></div>
            <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={set('phone')} placeholder="+250 7XX XXX XXX" /></div>
            <div><label className="label">Password *</label><input className="input" type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" required minLength={6} /></div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? <><Spinner size="sm" /><span>Creating...</span></> : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">Already have an account? <Link to="/login" className="text-iprc-600 font-medium">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
