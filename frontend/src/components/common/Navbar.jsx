import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const portalLink = user ? `/${user.role}` : '/login';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-iprc-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <span className="font-display font-bold text-gray-900 text-base">IPRC Campus</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[['/', 'Home'], ['/programs', 'Programs'], ['/apply/student', 'Apply'], ['/contact', 'Contact']].map(([path, label]) => (
            <Link key={path} to={path} className="text-sm text-gray-600 hover:text-iprc-600 px-3 py-2 rounded-lg hover:bg-iprc-50 transition-all">{label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <button onClick={() => navigate(portalLink)} className="btn-primary">My Portal</button>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Sign In</Link>
              <Link to="/apply/student" className="btn-primary">Apply Now</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`w-5 h-0.5 bg-gray-700 mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}/>
          <div className={`w-5 h-0.5 bg-gray-700 mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}/>
          <div className={`w-5 h-0.5 bg-gray-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}/>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {[['/', 'Home'], ['/programs', 'Programs'], ['/apply/student', 'Apply Now'], ['/contact', 'Contact']].map(([path, label]) => (
            <Link key={path} to={path} className="block text-sm text-gray-700 py-2 px-3 rounded-lg hover:bg-iprc-50 hover:text-iprc-700" onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex gap-2">
            <Link to="/login" className="btn-secondary flex-1 justify-center text-xs" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link to="/apply/student" className="btn-primary flex-1 justify-center text-xs" onClick={() => setMenuOpen(false)}>Apply</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
