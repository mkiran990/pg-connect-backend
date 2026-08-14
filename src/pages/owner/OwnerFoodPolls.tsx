import React, { useState, useEffect } from 'react';
import { Vote, Plus, Trash2, CheckCircle2, Lock, BarChart2, Globe } from 'lucide-react';
import { apiService } from '../../services/api';
import { FoodPoll } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

export const OwnerFoodPolls: React.FC = () => {
  const [polls, setPolls] = useState<FoodPoll[]>([]);
  const [loading, setLoading] = useState(true);

  // New Poll Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');

  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const loadPolls = async () => {
    try {
      const data = await apiService.getPolls();
      setPolls(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolls();
  }, []);

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const options = [option1, option2, option3].filter(o => o.trim().length > 0);
    if (!question || options.length < 2) return;

    try {
      await apiService.createPoll({ question, startDate, endDate, options });
      setToastMsg('Global food poll published successfully across all PG branches!');
      setIsModalOpen(false);
      setQuestion('');
      setOption1('');
      setOption2('');
      setOption3('');
      loadPolls();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleClosePoll = async (pollId: string) => {
    try {
      await apiService.closePoll(pollId);
      setToastMsg('Poll closed for voting.');
      loadPolls();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeletePoll = async () => {
    if (!deletingPollId) return;
    try {
      await apiService.deletePoll(deletingPollId);
      setToastMsg('Poll deleted.');
      setDeletingPollId(null);
      loadPolls();
      setTimeout(() => setToastMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  if (loading) return <CardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md text-[11px] font-bold border border-blue-200 mb-1">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Global Food Polls (All PGs)</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage Global Food Polls</h2>
          <p className="text-xs text-slate-500">
            Food polls are shared globally across all PG residents with consolidated voting results
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-700 hover:from-brand-700 hover:to-indigo-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-sm text-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Global Poll</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Polls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {polls.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
            No food polls active. Click "Create Global Poll" above to gather meal preferences from all residents.
          </div>
        ) : (
          polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.vote_count, 0);

            return (
              <div key={poll.id} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{poll.question}</h3>
                    {poll.is_closed ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Lock className="w-3 h-3" />
                        <span>Closed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>Live Voting</span>
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center space-x-3">
                    <span>Valid: {poll.start_date} to {poll.end_date}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-700">{totalVotes} Total Combined Votes</span>
                  </div>

                  {/* Options & Progress Bars */}
                  <div className="space-y-2 pt-2">
                    {poll.options.map((opt) => {
                      const percentage = totalVotes > 0 ? Math.round((opt.vote_count / totalVotes) * 100) : 0;
                      return (
                        <div key={opt.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800">{opt.option_text}</span>
                            <span className="font-extrabold text-brand-600">
                              {opt.vote_count} votes ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                  {!poll.is_closed && (
                    <button
                      onClick={() => handleClosePoll(poll.id)}
                      className="flex items-center space-x-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Close Poll</span>
                    </button>
                  )}
                  <button
                    onClick={() => setDeletingPollId(poll.id)}
                    className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Poll Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <div className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-1">
                <Globe className="w-3 h-3" />
                <span>Global Poll for All PG Residents</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Create Global Food Poll</h3>
              <p className="text-xs text-slate-500">Ask residents across all PG branches what they'd like for upcoming meals</p>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Poll Question *
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. What special meal do you prefer for Sunday lunch?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700 uppercase">
                  Poll Voting Options (Min 2 options required) *
                </label>
                <input
                  type="text"
                  required
                  value={option1}
                  onChange={(e) => setOption1(e.target.value)}
                  placeholder="Option 1 (e.g. Paneer Biryani / Chicken Biryani)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  required
                  value={option2}
                  onChange={(e) => setOption2(e.target.value)}
                  placeholder="Option 2 (e.g. Butter Naan & Dal Makhani)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  value={option3}
                  onChange={(e) => setOption3(e.target.value)}
                  placeholder="Option 3 (Optional)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                >
                  Publish Global Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingPollId}
        title="Delete Food Poll"
        message="Are you sure you want to remove this food poll? All resident votes will be erased."
        confirmText="Delete Poll"
        onConfirm={handleDeletePoll}
        onCancel={() => setDeletingPollId(null)}
      />
    </div>
  );
};
