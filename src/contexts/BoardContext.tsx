"use client";
import React, { createContext, useContext } from "react";
import { useBoard } from "@/hooks/useBoard";
import { CanvasProvider } from "./CanvasContext";

const BoardContext = createContext<ReturnType<typeof useBoard> | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const boardState = useBoard();
  
  return (
    <BoardContext.Provider value={boardState}>
      <CanvasProvider>
        {children}
      </CanvasProvider>
    </BoardContext.Provider>
  );
}

export function useBoardContext() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
}
