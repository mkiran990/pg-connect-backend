import React, { useState, useEffect } from 'react';
import { Utensils, Coffee, Sun, Moon } from 'lucide-react';
import { apiService } from '../../services/api';
import { WeeklyMenuItem } from '../../types';
import { CardSkeleton } from '../../components/common/SkeletonLoader';

export const ResidentFoodMenu: React.FC = () => {
  const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await apiService.getWeeklyMenu();
        setWeeklyMenu(data);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  if (loading) return <CardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Weekly Food Menu</h2>
          <p className="text-xs text-slate-500">Live menu updated directly by PG owner</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <Utensils className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {weeklyMenu.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-6 shadow-soft border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">{item.day_of_week}</h3>
              <span className="text-[11px] font-bold text-slate-400">3 Meals</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-100 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-700 font-bold">
                  <Coffee className="w-4 h-4" />
                  <span>Breakfast</span>
                </div>
                <p className="font-semibold text-slate-800">{item.breakfast}</p>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                  <Sun className="w-4 h-4" />
                  <span>Lunch</span>
                </div>
                <p className="font-semibold text-slate-800">{item.lunch}</p>
              </div>

              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-1">
                <div className="flex items-center space-x-1.5 text-indigo-700 font-bold">
                  <Moon className="w-4 h-4" />
                  <span>Dinner</span>
                </div>
                <p className="font-semibold text-slate-800">{item.dinner}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
