import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, CheckCircle2, MessageCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { Complaint, ComplaintStatus } from '../../types';
import { Badge } from '../../components/common/Badge';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

interface OwnerComplaintsProps {
  selectedPgId?: string;
}

export const OwnerComplaints: React.FC<OwnerComplaintsProps> = ({ selectedPgId = 'all' }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Response Modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [ownerResponse, setOwnerResponse] = useState('');

  const [toastMsg, setToastMsg] = useState('');

  const loadComplaints = async () => {
    try {
      const data = await apiService.getAllComplaints(selectedPgId);
      setComplaints(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, [selectedPgId]);

  const openRespondModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setNewStatus(c.status);
    setOwnerResponse(c.owner_response || '');
  };

  const handleSaveResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      await apiService.updateComplaintStatus(selectedComplaint.id, newStatus, ownerResponse);
      setToastMsg(`Updated ticket for ${selectedComplaint.full_name}`);
      setSelectedComplaint(null);
      loadComplaints();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.room_number?.includes(search);
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });



  if (loading) return <TableSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage Resident Complaints</h2>
          <p className="text-xs text-slate-500">
            {selectedPgId === 'all' ? 'Review and respond to support tickets across all branches' : 'Complaints submitted by residents in active PG'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resident, room, title..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
            No complaints found matching current filters.
          </div>
        ) : (
          filteredComplaints.map((c) => (
            <div key={c.id} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                    {c.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{c.full_name}</span>
                  <span className="text-xs text-slate-400">Room {c.room_number} • {c.pg_name || c.branch}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-slate-400 font-medium">{c.created_at}</span>
                  <Badge status={c.status} type="complaint" />
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-slate-900 mb-1">{c.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
              </div>

              {c.owner_response && (
                <div className="p-3 bg-brand-50/60 rounded-2xl border border-brand-100 text-xs space-y-1">
                  <span className="font-bold text-brand-900 block text-[11px]">Owner Response:</span>
                  <p className="text-brand-800">{c.owner_response}</p>
                </div>
              )}

              <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => openRespondModal(c)}
                  className="flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Update Status & Reply</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Response Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Update Complaint</h3>
              <p className="text-xs text-slate-500">{selectedComplaint.title}</p>
            </div>

            <form onSubmit={handleSaveResponse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Owner Resolution Response
                </label>
                <textarea
                  rows={3}
                  value={ownerResponse}
                  onChange={(e) => setOwnerResponse(e.target.value)}
                  placeholder="Provide resolution details or technician ETA..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                >
                  Submit Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
