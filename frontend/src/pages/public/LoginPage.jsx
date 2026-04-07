import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/common';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (role) => {
    const creds = { admin: ['admin@iprc.ac.rw','admin123'], trainer: ['trainer@iprc.ac.rw','trainer123'], student: ['student@iprc.ac.rw','student123'] };
    setForm({ email: creds[role][0], password: creds[role][1] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-iprc-50/50 via-white to-amber-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-iprc-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 fill-none stroke-white stroke-2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <span className="font-display font-bold text-gray-900 text-lg">IPRC Campus</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your campus portal</p>
        </div>

        {/* Quick login */}
        <div className="card p-4 mb-4">
          <p className="text-xs text-gray-500 mb-3 text-center">Quick demo login</p>
          <div className="grid grid-cols-3 gap-2">
            {['admin','trainer','student'].map(r => (
              <button key={r} onClick={() => quickLogin(r)}
                className="text-xs py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-iprc-50 hover:border-iprc-200 hover:text-iprc-700 transition-all capitalize font-medium">
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="you@iprc.ac.rw" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
              {loading ? <><Spinner size="sm" /><span>Signing in...</span></> : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            New student?{' '}
            <Link to="/apply/student" className="text-iprc-600 font-medium hover:text-iprc-800">Apply here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
