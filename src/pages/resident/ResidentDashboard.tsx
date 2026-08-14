import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Utensils, Vote, CreditCard, MessageSquarePlus, User, LogOut, BedDouble, Building2, ChevronRight
} from 'lucide-react';
import { ResidentFoodMenu } from './ResidentFoodMenu';
import { ResidentFoodPolls } from './ResidentFoodPolls';
import { ResidentFeeDetails } from './ResidentFeeDetails';
import { ResidentComplaints } from './ResidentComplaints';
import { ResidentProfile } from './ResidentProfile';
import { FirstTimeProfileModal } from './FirstTimeProfileModal';

export const ResidentDashboard: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'polls' | 'fees' | 'complaints' | 'profile'>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <FirstTimeProfileModal />

      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-brand-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-tealAccent-300">
              <Building2 className="w-4 h-4" />
              <span>{profile?.branch || 'Main Branch'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-tealAccent-300">{profile?.full_name || user?.email}</span>!
            </h1>
            <p className="text-xs text-slate-300">
              Assigned Room: <strong className="text-white">Room {profile?.room_number || '101'}</strong>
            </p>
          </div>

          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-slate-200 px-4 py-2 rounded-xl text-xs font-medium border border-white/15 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-2xl p-3 shadow-soft border border-slate-200 space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'menu'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>Weekly Food Menu</span>
              </button>

              <button
                onClick={() => setActiveTab('polls')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'polls'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Vote className="w-4 h-4" />
                <span>Food Polls</span>
              </button>

              <button
                onClick={() => setActiveTab('fees')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'fees'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Fee Details</span>
              </button>

              <button
                onClick={() => setActiveTab('complaints')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'complaints'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Raise Complaint</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>
            </div>
          </div>

          {/* Main Content View */}
          <div className="lg:col-span-9 space-y-6">

            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div
                    onClick={() => setActiveTab('fees')}
                    className="glass-card p-5 cursor-pointer hover:scale-105 space-y-2 border border-slate-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Payment Status</span>
                    <h3 className="font-extrabold text-lg text-slate-900">August Rent</h3>
                    <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      View Personal Fee
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('menu')}
                    className="glass-card p-5 cursor-pointer hover:scale-105 space-y-2 border border-slate-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Food Menu</span>
                    <h3 className="font-extrabold text-lg text-slate-900">Weekly Meals</h3>
                    <span className="inline-block text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      Check Mon - Sun Menu
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('polls')}
                    className="glass-card p-5 cursor-pointer hover:scale-105 space-y-2 border border-slate-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Vote className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Food Polls</span>
                    <h3 className="font-extrabold text-lg text-slate-900">Cast Your Vote</h3>
                    <span className="inline-block text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      1 Active Poll
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('complaints')}
                    className="glass-card p-5 cursor-pointer hover:scale-105 space-y-2 border border-slate-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                      <MessageSquarePlus className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Help & Support</span>
                    <h3 className="font-extrabold text-lg text-slate-900">Complaints</h3>
                    <span className="inline-block text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                      Raise Ticket
                    </span>
                  </div>

                </div>

                {/* Quick Profile Summary Card */}
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-extrabold text-base text-slate-900">Your Resident Profile Information</h3>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="text-xs font-bold text-brand-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Edit Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                      <span className="text-slate-400">Full Name</span>
                      <p className="font-bold text-slate-800">{profile?.full_name || 'Rahul Sharma'}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                      <span className="text-slate-400">Mobile Number</span>
                      <p className="font-bold text-slate-800">{profile?.mobile || '+91 98765 43210'}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                      <span className="text-slate-400">Assigned Room</span>
                      <p className="font-bold text-brand-600">Room {profile?.room_number || '101'}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                      <span className="text-slate-400">PG Branch</span>
                      <p className="font-bold text-slate-800">{profile?.branch || 'Main Branch'}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'menu' && <ResidentFoodMenu />}
            {activeTab === 'polls' && <ResidentFoodPolls />}
            {activeTab === 'fees' && <ResidentFeeDetails />}
            {activeTab === 'complaints' && <ResidentComplaints />}
            {activeTab === 'profile' && <ResidentProfile />}

          </div>

        </div>
      </div>
    </div>
  );
};
