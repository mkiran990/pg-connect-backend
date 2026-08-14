import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Eye, EyeOff, Shield, User, LogIn, UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'resident' | 'owner'>('resident');
  const [isSignUpMode, setIsSignUpMode] = useState<boolean>(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Initialize Google Sign-In GIS if client ID is set
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (googleClientId && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response?.credential) {
              setGoogleLoading(true);
              try {
                await loginWithGoogle(response.credential);
                navigate('/resident');
              } catch (err: any) {
                setErrorMessage(err.message || 'Google sign-in failed');
              } finally {
                setGoogleLoading(false);
              }
            }
          }
        });
      } catch (err) {
        console.warn('Google One Tap init skipped:', err);
      }
    }
  }, [loginWithGoogle, navigate]);

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setGoogleLoading(true);
    try {
      // Simulate Google credential for standalone demo or invoke GIS
      const mockCredential = 'mock_google_id_token_' + Date.now();
      await loginWithGoogle(mockCredential);
      navigate('/resident');
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (isSignUpMode && activeTab === 'resident') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      try {
        await signup(email, password);
        navigate('/resident');
      } catch (err: any) {
        setErrorMessage(err.message || 'Registration failed. Please try again.');
      }
      return;
    }

    try {
      await login(email, password, activeTab);
      if (activeTab === 'owner') {
        navigate('/owner');
      } else {
        navigate('/resident');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 subtle-gradient">
      <div className="w-full max-w-md space-y-6">

        {/* Back Link */}
        <Link to="/" className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to PG Connect Home</span>
        </Link>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-8 shadow-soft-lg border border-slate-200/80 space-y-6 animate-fade-in">

          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-tealAccent-500 flex items-center justify-center text-white mx-auto shadow-md">
              <Building2 className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {isSignUpMode ? 'Resident Registration' : (activeTab === 'owner' ? 'Owner Portal Login' : 'Resident Sign In')}
            </h2>
            <p className="text-slate-500 text-xs">
              {activeTab === 'owner' 
                ? 'Sign in to access admin management dashboard'
                : (isSignUpMode ? 'Create a resident account for PG Connect' : 'Enter your credentials to access resident portal')}
            </p>
          </div>

          {/* Role Tab Switcher */}
          {!isSignUpMode && (
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => { setActiveTab('resident'); setErrorMessage(''); }}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'resident'
                    ? 'bg-white text-brand-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Resident Login</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('owner'); setErrorMessage(''); }}
                className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'owner'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Owner Login</span>
              </button>
            </div>
          )}

          {/* Google Sign-In Button (For Residents) */}
          {activeTab === 'resident' && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl border border-slate-300 shadow-sm transition-all text-xs hover:border-slate-400 disabled:opacity-50"
              >
                {/* Official Google SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{googleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
                  or with email
                </span>
              </div>
            </div>
          )}

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'owner' ? 'owner@pgconnect.com' : 'resident@example.com'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Sign Up Mode) */}
            {isSignUpMode && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm text-slate-900"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-700 hover:from-brand-700 hover:to-indigo-800 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : isSignUpMode ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Resident Account</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In as {activeTab === 'owner' ? 'Owner' : 'Resident'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Accounts for Demo / Evaluation */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Demo Credentials</span>
            <div className="flex justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setActiveTab('owner'); setEmail('owner@pgconnect.com'); setPassword('OwnerPass123!'); }}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-2.5 py-1 rounded-lg font-medium"
              >
                Owner Demo
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('resident'); setEmail('rahul.sharma@example.com'); setPassword('Resident123!'); }}
                className="bg-brand-100 hover:bg-brand-200 text-brand-800 px-2.5 py-1 rounded-lg font-medium"
              >
                Resident Demo
              </button>
            </div>
          </div>

          {/* Mode Switcher Footer */}
          {activeTab === 'resident' && (
            <div className="pt-2 text-center text-xs text-slate-500">
              {isSignUpMode ? (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setIsSignUpMode(false); setErrorMessage(''); }}
                    className="font-bold text-brand-600 hover:underline"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  New resident?{' '}
                  <button
                    onClick={() => { setIsSignUpMode(true); setErrorMessage(''); }}
                    className="font-bold text-brand-600 hover:underline"
                  >
                    Create an account
                  </button>
                </span>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
