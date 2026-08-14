import React, { useState, useEffect } from 'react';
import { Users, Search, Edit, CheckCircle2, UserCheck, UserX, Shield, Globe } from 'lucide-react';
import { apiService } from '../../services/api';
import { ResidentProfile, PGProperty } from '../../types';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

interface OwnerResidentsProps {
  selectedPgId?: string;
}

export const OwnerResidents: React.FC<OwnerResidentsProps> = ({ selectedPgId = 'all' }) => {
  const [residents, setResidents] = useState<ResidentProfile[]>([]);
  const [pgList, setPgList] = useState<PGProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Edit Modal State
  const [editingResident, setEditingResident] = useState<ResidentProfile | null>(null);
  const [editRoom, setEditRoom] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [editPgId, setEditPgId] = useState('pg_1');
  const [editActive, setEditActive] = useState<boolean>(true);

  const [toastMsg, setToastMsg] = useState('');

  const loadData = async () => {
    try {
      const [resData, pgs] = await Promise.all([
        apiService.getResidents(selectedPgId),
        apiService.getPGList()
      ]);
      setResidents(resData);
      setPgList(pgs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPgId]);

  const openEdit = (res: ResidentProfile) => {
    setEditingResident(res);
    setEditRoom(res.room_number || '101');
    setEditBranch(res.branch || 'Main Branch');
    setEditPgId(res.pg_id || 'pg_1');
    setEditActive(Boolean(res.is_active));
  };

  const handleSave = async () => {
    if (!editingResident) return;
    try {
      const targetPg = pgList.find(p => p.id === editPgId);
      await apiService.updateResident(editingResident.user_id, {
        room_number: editRoom,
        branch: targetPg?.name || editBranch,
        pg_id: editPgId,
        is_active: editActive
      });
      setToastMsg(`Updated details for ${editingResident.full_name}`);
      setEditingResident(null);
      loadData();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.mobile?.includes(search) ||
      r.room_number?.includes(search) ||
      (r.branch && r.branch.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage PG Residents</h2>
          <p className="text-xs text-slate-500">
            {selectedPgId === 'all' ? 'All Registered Residents across all PG branches' : 'Residents enrolled in selected PG property'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, mobile, room..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-soft border border-slate-200 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Resident</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Room No.</th>
                <th className="p-4">Assigned PG Property</th>
                <th className="p-4">Auth Provider</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredResidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No residents found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredResidents.map((r) => (
                  <tr key={r.id || r.user_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center space-x-3">
                        {r.avatar_url ? (
                          <img src={r.avatar_url} alt={r.full_name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-extrabold text-xs">
                            {r.full_name ? r.full_name.charAt(0).toUpperCase() : 'R'}
                          </div>
                        )}
                        <div>
                          <div>{r.full_name}</div>
                          {r.created_at && <div className="text-[10px] text-slate-400 font-normal">Joined {r.created_at}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{r.mobile || '—'}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg">
                        Room {r.room_number}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      <span className="text-slate-800 font-semibold">{r.pg_name || r.branch}</span>
                    </td>
                    <td className="p-4">
                      {r.auth_provider === 'google' ? (
                        <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md text-[11px] border border-blue-200">
                          <Globe className="w-3 h-3 text-blue-500" />
                          <span>Google</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md text-[11px]">
                          <Shield className="w-3 h-3 text-slate-400" />
                          <span>Password</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {r.is_active ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[11px]">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-bold text-[11px]">
                          <UserX className="w-3.5 h-3.5" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEdit(r)}
                        className="inline-flex items-center space-x-1 text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl font-bold transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Cards */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredResidents.map((r) => (
            <div key={r.id || r.user_id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {r.avatar_url ? (
                    <img src={r.avatar_url} alt={r.full_name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-extrabold text-xs">
                      {r.full_name ? r.full_name.charAt(0).toUpperCase() : 'R'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-extrabold text-slate-900">{r.full_name}</h3>
                    <p className="text-[11px] text-slate-500">{r.mobile}</p>
                  </div>
                </div>
                <button
                  onClick={() => openEdit(r)}
                  className="text-brand-600 bg-brand-50 px-3 py-1 rounded-xl text-xs font-bold"
                >
                  Edit
                </button>
              </div>

              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                  Room {r.room_number}
                </span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                  {r.pg_name || r.branch}
                </span>
                {r.auth_provider === 'google' && (
                  <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md">
                    Google
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Resident Modal */}
      {editingResident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Edit Resident Details
              </h3>
              <p className="text-xs text-slate-500">{editingResident.full_name}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assign PG Property
                </label>
                <select
                  value={editPgId}
                  onChange={(e) => setEditPgId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  {pgList.map((pg) => (
                    <option key={pg.id} value={pg.id}>
                      {pg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assigned Room Number
                </label>
                <input
                  type="text"
                  value={editRoom}
                  onChange={(e) => setEditRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Account Status
                </label>
                <div className="flex items-center space-x-4 pt-1">
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={editActive}
                      onChange={() => setEditActive(true)}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>Active Resident</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={!editActive}
                      onChange={() => setEditActive(false)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>Inactive (Checked Out)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setEditingResident(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
