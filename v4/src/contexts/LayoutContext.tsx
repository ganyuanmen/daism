
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LayoutContextType {
  isShowBtn: boolean;
  setIsShowBtn: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isShowBtn, setIsShowBtn] = useState(false);
  useEffect(() => {
    if (window.sessionStorage.getItem('langSwitch') === '1') {
      setIsShowBtn(true);
      window.sessionStorage.removeItem('langSwitch');
    }
  }, []);

  return (
    <LayoutContext.Provider value={{ isShowBtn, setIsShowBtn }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}