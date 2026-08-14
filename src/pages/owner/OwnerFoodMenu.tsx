import React, { useState, useEffect } from 'react';
import { Utensils, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/api';
import { WeeklyMenuItem } from '../../types';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

interface OwnerFoodMenuProps {
  selectedPgId?: string;
}

export const OwnerFoodMenu: React.FC<OwnerFoodMenuProps> = ({ selectedPgId = 'pg_1' }) => {
  const targetPgId = selectedPgId === 'all' ? 'pg_1' : selectedPgId;
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const data = await apiService.getWeeklyMenu(targetPgId);
      setWeeklyMenu(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [targetPgId]);

  const handleMealChange = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner', value: string) => {
    const updated = [...weeklyMenu];
    updated[dayIndex][mealType] = value;
    setWeeklyMenu(updated);
  };

  const handleSaveMenu = async () => {
    setSaving(true);
    setToastMsg('');
    try {
      await apiService.updateWeeklyMenu(weeklyMenu, targetPgId);
      setToastMsg('Weekly food menu updated successfully for this PG property!');
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Manage Weekly Food Menu</h2>
          <p className="text-xs text-slate-500">Edit breakfast, lunch, and dinner meal plans for the selected property</p>
        </div>

        <button
          onClick={handleSaveMenu}
          disabled={saving}
          className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-700 hover:from-brand-700 hover:to-indigo-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm text-xs transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Weekly Menu'}</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Menu Cards */}
      <div className="space-y-4">
        {weeklyMenu.map((item, index) => (
          <div key={item.id || item.day_of_week} className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">{item.day_of_week}</h3>
              <span className="text-xs font-bold text-slate-400">Day {index + 1}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-amber-700 uppercase tracking-wider mb-1">
                  Breakfast *
                </label>
                <textarea
                  rows={2}
                  value={item.breakfast}
                  onChange={(e) => handleMealChange(index, 'breakfast', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 bg-amber-50/40"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  Lunch *
                </label>
                <textarea
                  rows={2}
                  value={item.lunch}
                  onChange={(e) => handleMealChange(index, 'lunch', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-emerald-50/40"
                />
              </div>

              <div>
                <label className="block font-bold text-indigo-700 uppercase tracking-wider mb-1">
                  Dinner *
                </label>
                <textarea
                  rows={2}
                  value={item.dinner}
                  onChange={(e) => handleMealChange(index, 'dinner', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-indigo-50/40"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
