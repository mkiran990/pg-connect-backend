import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, LogIn, LogOut, Menu, X, User, Shield, Home, Info, BedDouble, Utensils, Sparkles, PhoneCall } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-nav shadow-sm border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* TOP-LEFT: Login Icon/Button & Logo Section */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Top-Left Login / Dashboard Quick Action */}
            {!user ? (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-700 hover:from-brand-700 hover:to-indigo-800 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to={user.role === 'owner' ? '/owner' : '/resident'}
                  className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-3.5 py-1.5 rounded-xl text-sm transition-colors border border-slate-200"
                >
                  {user.role === 'owner' ? <Shield className="w-4 h-4 text-brand-600" /> : <User className="w-4 h-4 text-tealAccent-600" />}
                  <span className="max-w-[120px] truncate text-xs sm:text-sm font-semibold">
                    {user.role === 'owner' ? 'Owner Panel' : (profile?.full_name || 'Resident')}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Logo and Tagline */}
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-tealAccent-500 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-tight">
                  PG <span className="text-brand-600">Connect</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden md:inline">
                  Comfortable Living, Connected Digitally
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <a
              href="#about"
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              About
            </a>
            <a
              href="#rooms"
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Rooms
            </a>
            <a
              href="#menu"
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Food Menu
            </a>
            <a
              href="#facilities"
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Facilities
            </a>
            <a
              href="#contact"
              className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Contact
            </a>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-medium text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <Info className="w-4 h-4" />
            <span>About</span>
          </a>
          <a
            href="#rooms"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <BedDouble className="w-4 h-4" />
            <span>Rooms</span>
          </a>
          <a
            href="#menu"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <Utensils className="w-4 h-4" />
            <span>Food Menu</span>
          </a>
          <a
            href="#facilities"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Facilities</span>
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-100 font-medium text-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Contact</span>
          </a>

          {!user ? (
            <div className="pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-brand-600 text-white font-medium py-3 rounded-xl text-sm shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Login to Portal</span>
              </Link>
            </div>
          ) : (
            <div className="pt-2 flex items-center space-x-2">
              <Link
                to={user.role === 'owner' ? '/owner' : '/resident'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center space-x-2 bg-brand-50 text-brand-700 border border-brand-200 font-medium py-2.5 rounded-xl text-sm"
              >
                <span>Go to Dashboard</span>
              </Link>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
