
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface Session {
  did: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const SessionContext = createContext<Session>({
  did: null,
  isAuthenticated: false,
  isLoading: true,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>({
    did: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setSession({
          did: data.did,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setSession({
          did: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch  {
      setSession({
        did: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);