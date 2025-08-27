"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CanvasState {
  zoom: number;
  position: { x: number; y: number };
  scrollPosition: { x: number; y: number };
}

interface CanvasContextType {
  canvasState: CanvasState;
  updateCanvasState: (newState: Partial<CanvasState>) => void;
  setZoom: (zoom: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  setScrollPosition: (scrollPosition: { x: number; y: number }) => void;
  resetCanvasState: () => void;
}

const defaultCanvasState: CanvasState = {
  zoom: 1,
  position: { x: 0, y: 0 },
  scrollPosition: { x: 0, y: 0 }
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

interface CanvasProviderProps {
  children: ReactNode;
  initialState?: Partial<CanvasState>;
}

export function CanvasProvider({ children, initialState = {} }: CanvasProviderProps) {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    ...defaultCanvasState,
    ...initialState
  });

  const updateCanvasState = useCallback((newState: Partial<CanvasState>) => {
    setCanvasState(prev => ({
      ...prev,
      ...newState
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    updateCanvasState({ zoom });
  }, [updateCanvasState]);

  const setPosition = useCallback((position: { x: number; y: number }) => {
    updateCanvasState({ position });
  }, [updateCanvasState]);

  const setScrollPosition = useCallback((scrollPosition: { x: number; y: number }) => {
    updateCanvasState({ scrollPosition });
  }, [updateCanvasState]);

  const resetCanvasState = useCallback(() => {
    setCanvasState(defaultCanvasState);
  }, []);

  const value: CanvasContextType = {
    canvasState,
    updateCanvasState,
    setZoom,
    setPosition,
    setScrollPosition,
    resetCanvasState
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
}

// Hook específico para papers que precisam do estado do Canvas
export function useCanvasForPaper() {
  const { canvasState, updateCanvasState } = useCanvas();
  
  const restoreCanvasState = useCallback((state: CanvasState) => {
    updateCanvasState(state);
  }, [updateCanvasState]);

  return {
    canvasState,
    restoreCanvasState
  };
}
