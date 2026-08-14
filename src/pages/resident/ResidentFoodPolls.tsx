import React, { useState, useEffect } from 'react';
import { Vote, CheckCircle2, AlertCircle, BarChart2 } from 'lucide-react';
import { apiService } from '../../services/api';
import { FoodPoll } from '../../types';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

export const ResidentFoodPolls: React.FC = () => {
  const [polls, setPolls] = useState<FoodPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{ [pollId: string]: string }>({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  const handleVote = async (pollId: string) => {
    setErrorMsg('');
    setSuccessMsg('');

    const selectedOptId = selectedOptions[pollId];
    if (!selectedOptId) {
      setErrorMsg('Please select an option before casting your vote.');
      return;
    }

    try {
      await apiService.votePoll(pollId, selectedOptId);
      setSuccessMsg('Your vote has been submitted successfully!');
      loadPolls();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit vote');
    }
  };

  if (loading) return <CardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Food Polls</h2>
          <p className="text-xs text-slate-500">Vote for your favorite meal choices for upcoming menus</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <Vote className="w-5 h-5" />
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {polls.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
          <BarChart2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No active polls right now</h3>
          <p className="text-xs text-slate-400">The PG owner will publish new food polls soon!</p>
        </div>
      ) : (
        polls.map((poll) => {
          const totalVotes = poll.options.reduce((acc, o) => acc + o.vote_count, 0);
          const hasVoted = Boolean(poll.userVotedOptionId);

          return (
            <div key={poll.id} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    poll.is_closed ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {poll.is_closed ? 'Poll Closed' : 'Active Poll'}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900 mt-2">{poll.question}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Valid till {poll.end_date} • Total votes: {totalVotes}
                  </p>
                </div>

                {hasVoted && (
                  <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Voted</span>
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {poll.options.map((option) => {
                  const percentage = totalVotes > 0 ? Math.round((option.vote_count / totalVotes) * 100) : 0;
                  const isSelected = selectedOptions[poll.id] === option.id;
                  const isUserChoice = poll.userVotedOptionId === option.id;

                  return (
                    <div
                      key={option.id}
                      onClick={() => !hasVoted && !poll.is_closed && setSelectedOptions({ ...selectedOptions, [poll.id]: option.id })}
                      className={`relative overflow-hidden p-4 rounded-2xl border transition-all cursor-pointer ${
                        isUserChoice
                          ? 'border-emerald-500 bg-emerald-50/40'
                          : isSelected
                          ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-400/30'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      {/* Progress bar overlay for results */}
                      {(hasVoted || poll.is_closed) && (
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-brand-100/60 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name={`poll_${poll.id}`}
                            checked={isSelected || isUserChoice}
                            disabled={hasVoted || Boolean(poll.is_closed)}
                            onChange={() => setSelectedOptions({ ...selectedOptions, [poll.id]: option.id })}
                            className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-sm font-semibold text-slate-800">{option.option_text}</span>
                        </div>

                        {(hasVoted || poll.is_closed) && (
                          <div className="text-right text-xs">
                            <span className="font-bold text-slate-900">{percentage}%</span>
                            <span className="text-slate-500 ml-1">({option.vote_count} votes)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {!hasVoted && !poll.is_closed && (
                <button
                  onClick={() => handleVote(poll.id)}
                  className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm text-xs transition-all"
                >
                  Submit Vote
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
