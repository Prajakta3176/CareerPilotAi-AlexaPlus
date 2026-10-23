/**
 * CareerPilot AI — Authentication & User Profile Context
 * Manages user credentials, active profile, and authentication persistence.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  experienceLevel: 'Entry' | 'Mid-Level' | 'Senior' | 'Staff/Principal';
  targetCompany?: string;
  avatarUrl?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  quickDemoLogin: () => void;
  register: (name: string, email: string, targetRole: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const STORAGE_KEY = 'careerpilot_auth_user';

const DEMO_USER: UserProfile = {
  id: 'usr_alex_morgan',
  name: 'Alex Morgan',
  email: 'alex.morgan@cloudscale.io',
  targetRole: 'Senior Full-Stack Cloud Engineer',
  experienceLevel: 'Senior',
  targetCompany: 'Amazon / AWS Partners',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  joinedAt: 'October 2026',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse cached user:', e);
    }
    return null; // By default not logged in until user visits or clicks demo
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to persist user in localStorage:', e);
    }
  }, [user]);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // Simulate brief network authentication
    await new Promise((res) => setTimeout(res, 300));
    const loggedInUser: UserProfile = {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
      name: email.split('@')[0] || DEMO_USER.name,
    };
    setUser(loggedInUser);
    return true;
  };

  const quickDemoLogin = () => {
    setUser(DEMO_USER);
  };

  const register = async (name: string, email: string, targetRole: string): Promise<boolean> => {
    await new Promise((res) => setTimeout(res, 350));
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || 'Career Candidate',
      email: email || 'candidate@example.com',
      targetRole: targetRole || 'Full-Stack Engineer',
      experienceLevel: 'Senior',
      targetCompany: 'Amazon Alexa+ Tech Track',
      avatarUrl: DEMO_USER.avatarUrl,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        quickDemoLogin,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
