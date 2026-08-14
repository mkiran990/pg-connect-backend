import React, { useState, useEffect } from 'react';
import { MessageSquarePlus, Send, CheckCircle2, AlertCircle, Clock, MessageCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { Complaint, ComplaintCategory } from '../../types';
import { Badge } from '../../components/common/Badge';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

const CATEGORIES: ComplaintCategory[] = [
  'Food', 'Room', 'Water', 'Electricity', 'Wi-Fi', 'Cleaning', 'Maintenance', 'Other'
];

export const ResidentComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [category, setCategory] = useState<ComplaintCategory>('Wi-Fi');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [toastMsg, setToastMsg] = useState('');

  const loadComplaints = async () => {
    try {
      const data = await apiService.getMyComplaints();
      setComplaints(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);
    setToastMsg('');

    try {
      await apiService.submitComplaint({ category, title, description });
      setTitle('');
      setDescription('');
      setToastMsg('Complaint submitted successfully!');
      loadComplaints();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Raise Complaint & Support</h2>
          <p className="text-xs text-slate-500">Report issues regarding food, room, Wi-Fi, or maintenance directly to PG owner</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
          <MessageSquarePlus className="w-5 h-5" />
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Complaint Submission Form */}
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">Submit New Support Ticket</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-xs bg-slate-50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issue Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Geyser not working in Room 101"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details about the issue..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-xs transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Ticket</span>
          </button>
        </form>
      </div>

      {/* Existing Complaints List */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">My Raised Complaints ({complaints.length})</h3>

        {complaints.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400 border border-slate-200">
            No complaints raised yet.
          </div>
        ) : (
          complaints.map((comp) => (
            <div key={comp.id} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md uppercase">
                    {comp.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{comp.title}</h4>
                </div>
                <Badge status={comp.status} type="complaint" />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{comp.description}</p>

              {comp.owner_response && (
                <div className="p-3.5 bg-brand-50/70 border border-brand-100 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center space-x-1.5 text-brand-800 font-bold">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Owner Response</span>
                  </div>
                  <p className="text-brand-900 font-medium">{comp.owner_response}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
