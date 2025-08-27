"use client";
import React from "react";
import { motion } from "framer-motion";

interface GridOverlayProps {
  isVisible: boolean;
  gridSize: number;
  viewport: {
    x: number;
    y: number;
    scale: number;
  };
  boardSize: {
    width: number;
    height: number;
  };
}

export function GridOverlay({
  isVisible,
  gridSize,
  viewport,
  boardSize
}: GridOverlayProps) {
  if (!isVisible) return null;

  // Calcular posições do grid baseado no viewport
  const scaledGridSize = gridSize * viewport.scale;
  const offsetX = viewport.x % scaledGridSize;
  const offsetY = viewport.y % scaledGridSize;

  // Gerar linhas do grid
  const generateGridLines = () => {
    const lines = [];
    
    // Linhas verticais
    for (let x = offsetX; x < boardSize.width; x += scaledGridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={boardSize.height}
          className="grid-line"
        />
      );
    }
    
    // Linhas horizontais
    for (let y = offsetY; y < boardSize.height; y += scaledGridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={boardSize.width}
          y2={y}
          className="grid-line"
        />
      );
    }
    
    return lines;
  };

  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid-overlay"
      width={boardSize.width}
      height={boardSize.height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <defs>
        <pattern
          id="grid"
          width={scaledGridSize}
          height={scaledGridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${scaledGridSize} 0 L 0 0 0 ${scaledGridSize}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.1"
          />
        </pattern>
      </defs>
      
      <rect
        width="100%"
        height="100%"
        fill="url(#grid)"
      />
      
      {/* Linhas principais do grid */}
      {generateGridLines()}
    </motion.svg>
  );
}
