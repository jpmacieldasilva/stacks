"use client";
import { useState, useCallback } from "react";
import { Position } from "@/types/board";

export function useDragAndDrop() {
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const handleDragStart = useCallback((cardId: string, initialPosition: Position, mousePosition: Position) => {
    setDraggedCardId(cardId);
    setDragOffset({
      x: mousePosition.x - initialPosition.x,
      y: mousePosition.y - initialPosition.y
    });
  }, []);

  const handleDragMove = useCallback((mousePosition: Position) => {
    if (!draggedCardId) return;
    
    // Calcular nova posição baseada no mouse e offset
    const newPosition: Position = {
      x: mousePosition.x - dragOffset.x,
      y: mousePosition.y - dragOffset.y
    };
    
    return newPosition;
  }, [draggedCardId, dragOffset]);

  const handleDragEnd = useCallback(() => {
    setDraggedCardId(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    draggedCardId,
    dragOffset,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
}
