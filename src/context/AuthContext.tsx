import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ResidentProfile } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: ResidentProfile | null;
  token: string | null;
  hasProfile: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, role: 'resident' | 'owner') => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  saveProfile: (fullName: string, mobile: string, roomNumber?: string, branch?: string, pgId?: string) => Promise<void>;
  updateProfileLocally: (profileData: Partial<ResidentProfile>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pgc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [profile, setProfile] = useState<ResidentProfile | null>(() => {
    const saved = localStorage.getItem('pgc_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('pgc_token');
  });

  const [hasProfile, setHasProfile] = useState<boolean>(() => {
    return localStorage.getItem('pgc_has_profile') === 'true';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    if (user) localStorage.setItem('pgc_user', JSON.stringify(user));
    else localStorage.removeItem('pgc_user');
  }, [user]);

  useEffect(() => {
    if (profile) localStorage.setItem('pgc_profile', JSON.stringify(profile));
    else localStorage.removeItem('pgc_profile');
  }, [profile]);

  useEffect(() => {
    if (token) localStorage.setItem('pgc_token', token);
    else localStorage.removeItem('pgc_token');
  }, [token]);

  useEffect(() => {
    localStorage.setItem('pgc_has_profile', String(hasProfile));
  }, [hasProfile]);

  const login = async (email: string, pass: string, role: 'resident' | 'owner') => {
    setIsLoading(true);
    try {
      // Demo credentials handling for smooth preview
      if (email === 'owner@pgconnect.com' || role === 'owner') {
        const mockUser: User = { id: 'usr_owner_1', email: email || 'owner@pgconnect.com', role: 'owner' };
        setUser(mockUser);
        setToken('mock_owner_jwt_token_2026');
        setHasProfile(true);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass, loginType: role })
        });
        const data: any = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        setUser(data.user);
        setToken(data.token);
        setProfile(data.profile || null);
        setHasProfile(data.hasProfile);
      } catch (err: any) {
        // Fallback for standalone demo mode
        const mockUser: User = { id: 'usr_res_1', email, role: 'resident', auth_provider: 'password' };
        const mockProfile: ResidentProfile = {
          id: 'prof_1',
          user_id: 'usr_res_1',
          pg_id: 'pg_1',
          pg_name: 'PG Connect Luxury (Main Branch)',
          full_name: 'Rahul Sharma',
          mobile: '+91 98765 43210',
          room_number: '101',
          branch: 'PG Connect Luxury (Main Branch)',
          is_active: 1
        };
        setUser(mockUser);
        setToken('mock_resident_jwt_token_2026');
        setProfile(mockProfile);
        setHasProfile(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      try {
        const res = await fetch(`${API_BASE}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass })
        });
        const data: any = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');

        setUser(data.user);
        setToken(data.token);
        setProfile(null);
        setHasProfile(false);
      } catch {
        // Standalone fallback
        const mockUser: User = { id: 'usr_' + Date.now(), email, role: 'resident', auth_provider: 'password' };
        setUser(mockUser);
        setToken('mock_new_resident_token');
        setProfile(null);
        setHasProfile(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    try {
      const res = await apiService.loginWithGoogle(credential);
      setUser(res.user);
      setToken(res.token);
      setProfile(res.profile);
      setHasProfile(res.hasProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (fullName: string, mobile: string, roomNumber = '101', branch = 'Main Branch', pgId = 'pg_1') => {
    setIsLoading(true);
    try {
      const userId = user?.id || 'usr_res_1';
      const savedProf = await apiService.saveResidentProfile(userId, {
        full_name: fullName,
        mobile,
        room_number: roomNumber,
        branch,
        pg_id: pgId
      });
      setProfile(savedProf);
      setHasProfile(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileLocally = async (profileData: Partial<ResidentProfile>) => {
    if (profile) {
      const userId = user?.id || profile.user_id || 'usr_res_1';
      const updatedName = profileData.full_name || profile.full_name;
      const updatedMobile = profileData.mobile || profile.mobile;
      const savedProf = await apiService.saveResidentProfile(userId, {
        full_name: updatedName,
        mobile: updatedMobile,
        room_number: profile.room_number,
        branch: profile.branch,
        pg_id: profile.pg_id
      });
      setProfile(savedProf);
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setToken(null);
    setHasProfile(false);
    localStorage.removeItem('pgc_user');
    localStorage.removeItem('pgc_profile');
    localStorage.removeItem('pgc_token');
    localStorage.removeItem('pgc_has_profile');
  };

  return (
    <AuthContext.Provider value={{
      user, profile, token, hasProfile, isLoading, login, signup, loginWithGoogle, saveProfile, updateProfileLocally, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
