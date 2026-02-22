import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  joinAsGuest: (displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Create a guest account with a random email/password — the user only
   * ever sees their display name. Session is persisted via JWT in localStorage.
   */
  const joinAsGuest = async (displayName: string): Promise<void> => {
    setLoading(true);
    try {
      const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const email = `guest-${id}@play.local`;
      const password = id;

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, displayName, questionnaire: {} }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to join. Please try again.');
      }

      const { user, token } = await response.json();
      localStorage.setItem('token', token);
      setCurrentUser(user);
    } catch (error: any) {
      console.error('Guest join error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Profile update failed');

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Restore session on page load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setCurrentUser(data.user ?? data);
          } else {
            localStorage.removeItem('token');
          }
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, joinAsGuest, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
