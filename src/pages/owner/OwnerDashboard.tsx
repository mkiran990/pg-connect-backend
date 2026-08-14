import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, BedDouble, Utensils, Vote, CreditCard, MessageSquare, Building2, LogOut, TrendingUp, Sparkles, ChevronRight, Globe
} from 'lucide-react';
import { apiService } from '../../services/api';
import { OwnerStats } from '../../types';
import { PGSwitcher } from '../../components/owner/PGSwitcher';
import { OwnerResidents } from './OwnerResidents';
import { OwnerRooms } from './OwnerRooms';
import { OwnerFoodMenu } from './OwnerFoodMenu';
import { OwnerFoodPolls } from './OwnerFoodPolls';
import { OwnerFees } from './OwnerFees';
import { OwnerComplaints } from './OwnerComplaints';
import { OwnerPGInfo } from './OwnerPGInfo';

export const OwnerDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'residents' | 'rooms' | 'menu' | 'polls' | 'fees' | 'complaints' | 'info'>('dashboard');
  const [selectedPgId, setSelectedPgId] = useState<string>('all');
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await apiService.getOwnerStats(selectedPgId);
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [selectedPgId]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-indigo-900 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Owner & Admin Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              PG Connect Administration
            </h1>
            <p className="text-xs text-slate-400">
              Multi-property management for rooms, tariffs, food menus, resident accounts, and global food polls.
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-slate-200 px-4 py-2 rounded-xl text-xs font-medium border border-white/15 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Global Multi-PG Property Switcher */}
        <PGSwitcher
          selectedPgId={selectedPgId}
          onSelectPg={(pgId) => setSelectedPgId(pgId)}
          showAllOption={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Responsive Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-3xl p-3 shadow-soft border border-slate-200 space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('residents')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'residents'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Manage Residents</span>
              </button>

              <button
                onClick={() => setActiveTab('rooms')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'rooms'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BedDouble className="w-4 h-4" />
                <span>Manage Rooms & Rent</span>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'menu'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Manage Food Menu</span>
              </button>

              <button
                onClick={() => setActiveTab('polls')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'polls'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Vote className="w-4 h-4" />
                <div className="flex items-center space-x-1.5">
                  <span>Global Food Polls</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded">All PGs</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('fees')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'fees'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Manage Fees</span>
              </button>

              <button
                onClick={() => setActiveTab('complaints')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'complaints'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Manage Complaints</span>
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'info'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>PG Info & Facilities</span>
              </button>
            </div>
          </div>

          {/* Main Dashboard Panel */}
          <div className="lg:col-span-9 space-y-6">

            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                  <div onClick={() => setActiveTab('residents')} className="glass-card p-5 cursor-pointer hover:scale-105 space-y-2 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Total Residents</span>
                      <h3 className="text-2xl font-black text-slate-900">{stats?.totalResidents ?? '—'}</h3>
                    </div>
                  </div>

                  <div onClick={() => setActiveTab('rooms')} className="glass-card p-5 cursor-pointer hover:scale-105 space-y-2 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <BedDouble className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Available Rooms</span>
                      <h3 className="text-2xl font-black text-slate-900">
                        {stats?.availableRooms ?? '—'} <span className="text-xs font-normal text-slate-400">/ {stats?.totalRooms ?? '—'}</span>
                      </h3>
                    </div>
                  </div>

                  <div onClick={() => setActiveTab('fees')} className="glass-card p-5 cursor-pointer hover:scale-105 space-y-2 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Pending Fees</span>
                      <h3 className="text-2xl font-black text-slate-900">₹{stats?.pendingFees?.toLocaleString('en-IN') ?? 0}</h3>
                    </div>
                  </div>

                  <div onClick={() => setActiveTab('complaints')} className="glass-card p-5 cursor-pointer hover:scale-105 space-y-2 border border-slate-200">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Open Tickets</span>
                      <h3 className="text-2xl font-black text-slate-900">{stats?.openComplaints ?? '—'}</h3>
                    </div>
                  </div>

                </div>

                {/* Quick Management Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                          <BedDouble className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">Room Tariffs & Availability</h3>
                          <p className="text-xs text-slate-500">Update monthly & yearly rents across rooms</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('rooms')}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Total Rooms Configured</span>
                      <span className="font-extrabold text-slate-900">{stats?.totalRooms ?? 0} Rooms</span>
                    </div>

                    <button
                      onClick={() => setActiveTab('rooms')}
                      className="w-full py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-xl text-xs transition-colors"
                    >
                      Configure Room Tariffs
                    </button>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Vote className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">Global Food Polls (All PGs)</h3>
                          <p className="text-xs text-slate-500">Gather meal choices from all PG residents</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('polls')}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Active Live Polls</span>
                      <span className="font-extrabold text-indigo-700">{stats?.activePolls ?? 0} Active</span>
                    </div>

                    <button
                      onClick={() => setActiveTab('polls')}
                      className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors"
                    >
                      Manage Global Polls
                    </button>
                  </div>

                </div>

              </div>
            )}

            {activeTab === 'residents' && <OwnerResidents selectedPgId={selectedPgId} />}
            {activeTab === 'rooms' && <OwnerRooms selectedPgId={selectedPgId} />}
            {activeTab === 'menu' && <OwnerFoodMenu selectedPgId={selectedPgId} />}
            {activeTab === 'polls' && <OwnerFoodPolls />}
            {activeTab === 'fees' && <OwnerFees selectedPgId={selectedPgId} />}
            {activeTab === 'complaints' && <OwnerComplaints selectedPgId={selectedPgId} />}
            {activeTab === 'info' && <OwnerPGInfo selectedPgId={selectedPgId} />}

          </div>
        </div>
      </div>
    </div>
  );
};
