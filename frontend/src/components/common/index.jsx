import React, { useState } from 'react';

// ── Spinner ───────────────────────────────────────────
export const Spinner = ({ size = 'md' }) => {
  const s = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return <div className={`${s} border-2 border-iprc-600 border-t-transparent rounded-full animate-spin`} />;
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  </div>
);

// ── Modal ─────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${widths[size]} max-h-[90vh] overflow-y-auto animate-slide-up`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-display font-semibold text-gray-900 text-lg">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// ── StatCard ──────────────────────────────────────────
export const StatCard = ({ label, value, icon, color = 'green', sub }) => {
  const colors = {
    green: 'bg-iprc-50 text-iprc-800',
    amber: 'bg-amber-50 text-amber-800',
    blue:  'bg-blue-50 text-blue-800',
    red:   'bg-red-50 text-red-700',
    purple:'bg-purple-50 text-purple-800',
  };
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-display font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        {icon && <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>{icon}</div>}
      </div>
    </div>
  );
};

// ── Badge ─────────────────────────────────────────────
export const Badge = ({ status }) => {
  const map = {
    pending:  'badge-amber', approved: 'badge-green', confirmed: 'badge-green',
    rejected: 'badge-red',   active:   'badge-green',  draft: 'badge-gray',
    archived: 'badge-gray',  present:  'badge-green',  absent: 'badge-red',
    late:     'badge-amber',  paid: 'badge-green',     unpaid: 'badge-red',
    partial:  'badge-amber',  male: 'badge-blue',      female: 'badge-blue',
  };
  return <span className={map[status] || 'badge-gray'}>{status}</span>;
};

// ── EmptyState ────────────────────────────────────────
export const EmptyState = ({ icon = '📭', title, message, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="font-display font-semibold text-gray-800 text-lg mb-2">{title}</h3>
    <p className="text-gray-500 text-sm max-w-sm mb-6">{message}</p>
    {action}
  </div>
);

// ── SearchBar ─────────────────────────────────────────
export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
    <input className="input pl-9 w-64" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

// ── ConfirmDialog ─────────────────────────────────────
export const ConfirmDialog = ({ open, onClose, onConfirm, title, message, danger }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-gray-600 mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <button className="btn-secondary" onClick={onClose}>Cancel</button>
      <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={() => { onConfirm(); onClose(); }}>Confirm</button>
    </div>
  </Modal>
);

// ── Select ────────────────────────────────────────────
export const Select = ({ label, value, onChange, options, required, className = '' }) => (
  <div className={className}>
    {label && <label className="label">{label}</label>}
    <select className="input" value={value} onChange={e => onChange(e.target.value)} required={required}>
      <option value="">Select {label}</option>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

// ── FormField ─────────────────────────────────────────
export const FormField = ({ label, type = 'text', value, onChange, required, placeholder, className = '', rows }) => (
  <div className={className}>
    {label && <label className="label">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
    {type === 'textarea'
      ? <textarea className="input resize-none" value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} rows={rows || 3} />
      : <input className="input" type={type} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} />
    }
  </div>
);

// ── Avatar ────────────────────────────────────────────
export const Avatar = ({ name = '', size = 'md', color = 'green' }) => {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
  const colors = { green: 'bg-iprc-50 text-iprc-800', amber: 'bg-amber-50 text-amber-800', blue: 'bg-blue-50 text-blue-800' };
  return <div className={`${sizes[size]} ${colors[color]} rounded-full flex items-center justify-center font-semibold flex-shrink-0`}>{initials}</div>;
};

// ── FileTypeBadge ─────────────────────────────────────
export const FileTypeBadge = ({ type }) => {
  const map = { pdf: 'bg-red-50 text-red-700', docx: 'bg-blue-50 text-blue-700', pptx: 'bg-orange-50 text-orange-700', video: 'bg-purple-50 text-purple-700', zip: 'bg-gray-100 text-gray-600' };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded ${map[type] || 'bg-gray-100 text-gray-600'}`}>{(type || 'file').toUpperCase()}</span>;
};

export default {};
