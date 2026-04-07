import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common';
import toast from 'react-hot-toast';

const Logo = () => (
  <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
    <div className="w-9 h-9 bg-iprc-600 rounded-xl flex items-center justify-center flex-shrink-0">
      <svg className="w-5 h-5 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    </div>
    <div>
      <p className="font-display font-bold text-gray-900 text-sm leading-tight">IPRC Campus</p>
      <p className="text-xs text-gray-400">Smart System</p>
    </div>
  </div>
);

export const Sidebar = ({ links }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-iprc-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
          </div>
          <span className="font-display font-bold text-gray-900 text-sm">IPRC Campus</span>
        </div>
        <button onClick={() => setOpen(!open)} className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-gray-100">
          <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${open ? 'opacity-0' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`}/>
        </button>
      </div>

      {/* Overlay */}
      {open && <div className="lg:hidden fixed inset-0 z-30 bg-black/20" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-40 flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <Logo />
        {/* User */}
        <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
          <Avatar name={user?.name} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {links.map((section, si) => (
            <div key={si} className={si > 0 ? 'mt-4' : ''}>
              {section.label && <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">{section.label}</p>}
              {section.items.map((item) => (
                <NavLink key={item.path} to={item.path} end={item.end}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setOpen(false)}>
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
            <span>🚪</span><span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
