import React, { useEffect, useState } from 'react';
import { getStudents, approveStudent, rejectStudent } from '../../services/api';
import { Badge, Modal, SearchBar, Spinner, EmptyState, ConfirmDialog } from '../../components/common';
import toast from 'react-hot-toast';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [note, setNote] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getStudents({ status: statusFilter || undefined, search });
      setStudents(res.data.data);
    } catch { toast.error('Failed to load students'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const filtered = students.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.userId?.name?.toLowerCase().includes(q) || s.userId?.email?.toLowerCase().includes(q) || s.studentId?.toLowerCase().includes(q);
  });

  const handleApprove = async (id) => {
    try {
      await approveStudent(id, { adminNote: note });
      toast.success('Student approved & confirmed!');
      setSelected(null); setNote('');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleReject = async (id) => {
    try {
      await rejectStudent(id, { adminNote: note });
      toast.success('Application rejected');
      setSelected(null); setNote('');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">{students.length} total records</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or ID..." />
        <div className="flex gap-2 flex-wrap">
          {['', 'pending', 'approved', 'rejected'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize
                ${statusFilter === s ? 'bg-iprc-600 text-white border-iprc-600' : 'bg-white text-gray-600 border-gray-200 hover:border-iprc-300'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="🎓" title="No students found" message="Try adjusting your filters or search." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Student','Program','Campus','Status','Student ID','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-iprc-50 rounded-full flex items-center justify-center font-semibold text-iprc-800 text-xs flex-shrink-0">
                          {(s.userId?.name || '?').split(' ').map(w => w[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{s.userId?.name}</p>
                          <p className="text-xs text-gray-400">{s.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.program}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.campus}</td>
                    <td className="px-4 py-3"><Badge status={s.applicationStatus} /></td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{s.studentId || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelected(s); setNote(''); }}
                        className="text-xs text-iprc-600 hover:text-iprc-800 font-medium px-2 py-1 rounded hover:bg-iprc-50 transition-colors">
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Student Application" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-iprc-50 rounded-full flex items-center justify-center font-display font-bold text-iprc-800 text-xl">
                {(selected.userId?.name || '?').split(' ').map(w => w[0]).join('').slice(0,2)}
              </div>
              <div>
                <h3 className="font-display font-semibold text-xl text-gray-900">{selected.userId?.name}</h3>
                <p className="text-sm text-gray-500">{selected.userId?.email} · {selected.userId?.phone}</p>
              </div>
              <div className="ml-auto"><Badge status={selected.applicationStatus} /></div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 text-sm">
              {[['National ID', selected.nationalId],['Program', selected.program],['Campus', selected.campus],['Applied', new Date(selected.createdAt).toLocaleDateString()],['Student ID', selected.studentId || 'Not assigned'],['Confirmed', selected.confirmed ? 'Yes' : 'No']].map(([l,v]) => (
                <div key={l}><p className="text-xs text-gray-400 mb-0.5">{l}</p><p className="font-medium text-gray-800">{v}</p></div>
              ))}
            </div>

            {selected.adminNote && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs text-amber-700 font-medium mb-1">Admin note</p>
                <p className="text-sm text-amber-900">{selected.adminNote}</p>
              </div>
            )}

            {selected.applicationStatus === 'pending' && (
              <div>
                <label className="label">Admin Note (optional)</label>
                <textarea className="input resize-none" rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note for this student..." />
                <div className="flex gap-3 mt-3">
                  <button onClick={() => handleApprove(selected._id)} className="btn-primary flex-1 justify-center bg-iprc-600">✓ Approve & Confirm</button>
                  <button onClick={() => handleReject(selected._id)} className="btn-danger flex-1 justify-center">✕ Reject</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
