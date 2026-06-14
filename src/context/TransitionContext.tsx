'use client';

import React, { createContext, useContext, useState } from 'react';

interface TransitionContextType {
  doorImage: string | null;
  setDoorImage: (img: string | null) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within a TransitionProvider');
  }
  return context;
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [doorImage, setDoorImage] = useState<string | null>(null);

  return (
    <TransitionContext.Provider value={{ doorImage, setDoorImage }}>
      {children}
    </TransitionContext.Provider>
  );
}
