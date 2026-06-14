'use client';

import React, { createContext, useContext, useState } from 'react';

interface TransitionContextType {
  doorImage: string | null;
  setDoorImage: (img: string | null) => void;
  transitionComplete: boolean;
  setTransitionComplete: (v: boolean) => void;
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
  const [transitionComplete, setTransitionComplete] = useState(false);

  return (
    <TransitionContext.Provider value={{ doorImage, setDoorImage, transitionComplete, setTransitionComplete }}>
      {children}
    </TransitionContext.Provider>
  );
}
