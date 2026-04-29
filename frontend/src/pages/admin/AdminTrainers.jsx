import React, { useEffect, useState } from 'react';
import { getTrainers, approveTrainer, rejectTrainer } from '../../services/api';
import { Badge, Modal, SearchBar, Spinner, EmptyState } from '../../components/common';
import toast from 'react-hot-toast';

export default function AdminTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await getTrainers({ status: filter || undefined });
      setTrainers(res.data.data);
    } catch { toast.error('Failed to load trainers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const filtered = trainers.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.userId?.name?.toLowerCase().includes(q) || t.userId?.email?.toLowerCase().includes(q) || t.department?.toLowerCase().includes(q);
  });

  const handleApprove = async (id) => {
    try { await approveTrainer(id, {}); toast.success('Trainer approved!'); setSelected(null); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };
  const handleReject = async (id) => {
    try { await rejectTrainer(id, { adminNote: note }); toast.success('Application rejected'); setSelected(null); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Trainers</h1>
        <p className="text-sm text-gray-500 mt-0.5">{trainers.length} total records</p>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search trainers..." />
        <div className="flex gap-2 flex-wrap">
          {['','pending','approved'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${filter===s?'bg-iprc-600 text-white border-iprc-600':'bg-white text-gray-600 border-gray-200 hover:border-iprc-300'}`}>
              {s||'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg"/></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="👨‍🏫" title="No trainers found" message="Adjust your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Trainer','Department','Qualification','Experience','Status','Actions'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(t => (
                  <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center font-semibold text-amber-800 text-xs flex-shrink-0">
                          {(t.userId?.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{t.userId?.name}</p>
                          <p className="text-xs text-gray-400">{t.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{t.department}</td>
                    <td className="px-4 py-3 text-gray-600">{t.qualification}</td>
                    <td className="px-4 py-3 text-gray-600">{t.experience} yrs</td>
                    <td className="px-4 py-3"><Badge status={t.applicationStatus}/></td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelected(t); setNote(''); }} className="text-xs text-iprc-600 hover:text-iprc-800 font-medium px-2 py-1 rounded hover:bg-iprc-50">View →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Trainer Application" size="md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center font-display font-bold text-amber-800 text-lg">
                {(selected.userId?.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selected.userId?.name}</h3>
                <p className="text-sm text-gray-500">{selected.userId?.email}</p>
              </div>
              <div className="ml-auto"><Badge status={selected.applicationStatus}/></div>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4 text-sm">
              {[['Department',selected.department],['Qualification',selected.qualification],['Experience',`${selected.experience} years`],['Specialization',selected.specialization||'—'],['Campus',selected.campus||'—'],['Applied',new Date(selected.createdAt).toLocaleDateString()]].map(([l,v])=>(
                <div key={l}><p className="text-xs text-gray-400 mb-0.5">{l}</p><p className="font-medium text-gray-800">{v}</p></div>
              ))}
            </div>
            {selected.applicationStatus === 'pending' && (
              <div className="flex gap-3 pt-2">
                <button onClick={() => handleApprove(selected._id)} className="btn-primary flex-1 justify-center">✓ Approve</button>
                <button onClick={() => handleReject(selected._id)} className="btn-danger flex-1 justify-center">✕ Reject</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
