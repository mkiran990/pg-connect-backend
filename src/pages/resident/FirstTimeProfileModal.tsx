import React, { useState, useEffect } from 'react';
import { UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { PGProperty } from '../../types';

export const FirstTimeProfileModal: React.FC = () => {
  const { hasProfile, saveProfile, isLoading, user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [roomNumber, setRoomNumber] = useState('101');
  const [branch, setBranch] = useState('PG Connect Luxury (Main Branch)');
  const [pgId, setPgId] = useState('pg_1');
  const [pgList, setPgList] = useState<PGProperty[]>([]);

  useEffect(() => {
    async function loadPGs() {
      try {
        const pgs = await apiService.getPGList();
        setPgList(pgs);
        if (pgs.length > 0) {
          setPgId(pgs[0].id);
          setBranch(pgs[0].name);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadPGs();
  }, []);

  if (hasProfile) return null; // Appears only once until profile is saved

  const handlePGChange = (newPgId: string) => {
    setPgId(newPgId);
    const selected = pgList.find(p => p.id === newPgId);
    if (selected) setBranch(selected.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobile) return;
    await saveProfile(fullName, mobile, roomNumber, branch, pgId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-soft-lg border border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
            <UserCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome to PG Connect!</h2>
          <p className="text-slate-500 text-xs leading-relaxed">
            Please complete your one-time resident profile setup to unlock full access to the portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Room Number
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="101"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned PG Branch
              </label>
              <select
                value={pgId}
                onChange={(e) => handlePGChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-sm bg-white"
              >
                {pgList.map((pg) => (
                  <option key={pg.id} value={pg.id}>
                    {pg.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-700 hover:from-brand-700 hover:to-indigo-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm mt-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Save Profile & Continue</span>
          </button>
        </form>
      </div>
    </div>
  );
};
