// app/contexts/SessionContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  did: string;
  ip?: string;
  userAgent?: string;
}

interface SessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查 session 状态
  const checkSession = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/siwe/getLoginUser');
      
      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to check session:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 登出
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      // 强制刷新页面以清除所有状态
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // 组件挂载时检查 session
  useEffect(() => {
    checkSession();
  }, []);

  const value: SessionContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    checkSession,
    logout
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook 使用 session
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};