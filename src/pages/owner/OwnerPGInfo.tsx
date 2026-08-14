import React, { useState, useEffect } from 'react';
import { Building2, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/api';
import { PGInformation } from '../../types';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

interface OwnerPGInfoProps {
  selectedPgId?: string;
}

export const OwnerPGInfo: React.FC<OwnerPGInfoProps> = ({ selectedPgId = 'pg_1' }) => {
  const targetPgId = selectedPgId === 'all' ? 'pg_1' : selectedPgId;
  const [pgInfo, setPgInfo] = useState<PGInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadInfo = async () => {
    setLoading(true);
    try {
      const { info } = await apiService.getPGInfo(targetPgId);
      setPgInfo(info);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfo();
  }, [targetPgId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pgInfo) return;
    setSaving(true);
    setToastMsg('');

    try {
      const updated = await apiService.updatePGInfo(pgInfo, targetPgId);
      setPgInfo(updated);
      setToastMsg('Property details updated successfully! Changes are live on the public website.');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !pgInfo) return <CardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage PG Property Information</h2>
          <p className="text-xs text-slate-500">Edit contact details, address, and Google Maps location for the active PG</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">PG Name *</label>
              <input
                type="text"
                required
                value={pgInfo.pg_name}
                onChange={(e) => setPgInfo({ ...pgInfo, pg_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline *</label>
              <input
                type="text"
                required
                value={pgInfo.tagline}
                onChange={(e) => setPgInfo({ ...pgInfo, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">PG Description *</label>
            <textarea
              rows={3}
              required
              value={pgInfo.description}
              onChange={(e) => setPgInfo({ ...pgInfo, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Address *</label>
            <textarea
              rows={2}
              required
              value={pgInfo.address}
              onChange={(e) => setPgInfo({ ...pgInfo, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Google Maps Location Link *</label>
            <input
              type="url"
              required
              value={pgInfo.google_maps_link}
              onChange={(e) => setPgInfo({ ...pgInfo, google_maps_link: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={pgInfo.owner_name}
                onChange={(e) => setPgInfo({ ...pgInfo, owner_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Contact *</label>
              <input
                type="tel"
                required
                value={pgInfo.mobile_number}
                onChange={(e) => setPgInfo({ ...pgInfo, mobile_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Number (e.g. 919876543210) *</label>
              <input
                type="text"
                required
                value={pgInfo.whatsapp_number}
                onChange={(e) => setPgInfo({ ...pgInfo, whatsapp_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-700 hover:from-brand-700 hover:to-indigo-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save Property Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
