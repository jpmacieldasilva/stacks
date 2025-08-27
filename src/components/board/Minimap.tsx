"use client";
import React, { useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { CardData } from "@/types/board";

type MinimapProps = {
  cards: CardData[];
  viewport: { x: number; y: number; scale: number };
  boardBounds: { width: number; height: number };
  onViewportChange: (viewport: { x: number; y: number; scale: number }) => void;
  className?: string;
};

export function Minimap({ 
  cards, 
  viewport, 
  boardBounds, 
  onViewportChange,
  className 
}: MinimapProps) {
  const minimapRef = useRef<HTMLDivElement>(null);
  const minimapSize = { width: 120, height: 100 };

  // Calcular bounds do conteúdo de forma mais simples
  const contentBounds = useMemo(() => {
    if (cards.length === 0) {
      return { minX: -1000, maxX: 1000, minY: -1000, maxY: 1000 };
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    cards.forEach(card => {
      minX = Math.min(minX, card.position.x);
      maxX = Math.max(maxX, card.position.x);
      minY = Math.min(minY, card.position.y);
      maxY = Math.max(maxY, card.position.y);
    });

    // Adicionar margem
    const margin = 500;
    minX -= margin;
    maxX += margin;
    minY -= margin;
    maxY += margin;

    return { minX, maxX, minY, maxY };
  }, [cards]);

  const contentWidth = contentBounds.maxX - contentBounds.minX;
  const contentHeight = contentBounds.maxY - contentBounds.minY;

  // Escala simples
  const scale = Math.min(
    minimapSize.width / contentWidth,
    minimapSize.height / contentHeight
  );

  // Converter coordenadas do mundo para minimap
  const worldToMinimap = useCallback((worldX: number, worldY: number) => {
    return {
      x: (worldX - contentBounds.minX) * scale,
      y: (worldY - contentBounds.minY) * scale
    };
  }, [contentBounds, scale]);

  // Converter coordenadas do minimap para mundo
  const minimapToWorld = useCallback((minimapX: number, minimapY: number) => {
    return {
      x: minimapX / scale + contentBounds.minX,
      y: minimapY / scale + contentBounds.minY
    };
  }, [contentBounds, scale]);

  // Calcular viewport no minimap
  const viewportRect = useMemo(() => {
    // Posição do viewport no mundo
    const worldX = -viewport.x / viewport.scale;
    const worldY = -viewport.y / viewport.scale;
    
    // Converter para minimap
    const minimapX = worldToMinimap(worldX, worldY).x;
    const minimapY = worldToMinimap(worldX, worldY).y;
    
    // Dimensões do viewport
    const width = (boardBounds.width / viewport.scale) * scale;
    const height = (boardBounds.height / viewport.scale) * scale;
    
    return {
      x: Math.max(0, Math.min(minimapX, minimapSize.width - width)),
      y: Math.max(0, Math.min(minimapY, minimapSize.height - height)),
      width: Math.min(width, minimapSize.width),
      height: Math.min(height, minimapSize.height)
    };
  }, [viewport, boardBounds, scale, worldToMinimap, minimapSize.width, minimapSize.height]);

  const handleMinimapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = minimapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    if (clickX < 0 || clickX > minimapSize.width || clickY < 0 || clickY > minimapSize.height) {
      return;
    }
    
    const worldPos = minimapToWorld(clickX, clickY);
    
    const newViewport = {
      x: -worldPos.x * viewport.scale + boardBounds.width / 2,
      y: -worldPos.y * viewport.scale + boardBounds.height / 2,
      scale: viewport.scale
    };
    
    onViewportChange(newViewport);
  }, [minimapToWorld, boardBounds, viewport.scale, onViewportChange, minimapSize.width, minimapSize.height]);

  return (
    <div className={`fixed bottom-6 left-6 z-40 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Container do minimap - padrão do projeto */}
        <div className="figma-toolbar overflow-hidden">
          {/* Canvas do minimap */}
          <div 
            ref={minimapRef}
            className="relative cursor-pointer"
            style={{ 
              width: minimapSize.width, 
              height: minimapSize.height 
            }}
            onClick={handleMinimapClick}
          >
            {/* Cards como pontos brancos/claros */}
            {cards.map((card) => {
              const pos = worldToMinimap(card.position.x, card.position.y);
              
              // Verificar se está visível
              if (pos.x < -5 || pos.x > minimapSize.width + 5 || pos.y < -5 || pos.y > minimapSize.height + 5) {
                return null;
              }
              
              return (
                <div
                  key={card.id}
                  className="absolute w-2 h-2 bg-[#d9d9d9] rounded-full border border-[#d9d9d9] shadow-sm"
                  style={{
                    left: pos.x - 4,
                    top: pos.y - 4,
                  }}
                  title={`${card.type} - ${card.content.substring(0, 20)}...`}
                />
              );
            })}

            {/* Viewport indicator */}
            <div
              className="absolute border-2 border-blue-500 bg-blue-100/30 pointer-events-none rounded-sm"
              style={{
                left: viewportRect.x,
                top: viewportRect.y,
                width: viewportRect.width,
                height: viewportRect.height,
              }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}