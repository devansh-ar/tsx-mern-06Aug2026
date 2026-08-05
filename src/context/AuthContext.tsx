import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { createMockJWT, isTokenExpired, getTimeUntilExpiry } from '../utils/jwt';
import type { User } from '../types';

// Mock credentials
const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('sw_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User;
        if (!isTokenExpired(parsed.token)) return parsed;
      } catch {
        // ignore
      }
    }
    return null;
  });

  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = useCallback((token: string, _refreshToken: string, username: string) => {
    const secondsLeft = getTimeUntilExpiry(token);
    // Refresh 30 seconds before expiry
    const delay = Math.max(0, (secondsLeft - 30) * 1000);

    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    refreshTimerRef.current = setTimeout(() => {
      // Silent refresh: issue new token
      const newToken = createMockJWT(username, 300);
      const newRefreshToken = createMockJWT(username, 3600);
      const updatedUser: User = { username, token: newToken, refreshToken: newRefreshToken };
      setUser(updatedUser);
      localStorage.setItem('sw_user', JSON.stringify(updatedUser));
      scheduleRefresh(newToken, newRefreshToken, username);
    }, delay);
  }, []);

  useEffect(() => {
    if (user) {
      scheduleRefresh(user.token, user.refreshToken, user.username);
    }
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [user, scheduleRefresh]);

  const login = async (username: string, password: string): Promise<void> => {
    if (username !== MOCK_CREDENTIALS.username || password !== MOCK_CREDENTIALS.password) {
      throw new Error('Invalid username or password');
    }
    const token = createMockJWT(username, 300); // 5 min
    const refreshToken = createMockJWT(username, 3600); // 1 hour
    const newUser: User = { username, token, refreshToken };
    setUser(newUser);
    localStorage.setItem('sw_user', JSON.stringify(newUser));
  };

  const logout = () => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    setUser(null);
    localStorage.removeItem('sw_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
