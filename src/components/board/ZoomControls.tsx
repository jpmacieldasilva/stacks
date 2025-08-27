"use client";
import React from "react";
import { motion } from "framer-motion";

type ZoomControlsProps = {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  minZoom?: number;
  maxZoom?: number;
};

export function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  minZoom = 0.1,
  maxZoom = 2
}: ZoomControlsProps) {
  const percentage = Math.round(scale * 100);
  const canZoomIn = scale < maxZoom;
  const canZoomOut = scale > minZoom;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <motion.div 
        className="figma-toolbar flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Botão Zoom In */}
        <button
          onClick={onZoomIn}
          disabled={!canZoomIn}
          className={`w-6 h-6 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors ${
            !canZoomIn ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Zoom In (+)"
          aria-label={`Zoom in. Current zoom: ${percentage}%`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 18 18">
            <path d="M9 2V16M2 9H16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </button>

        {/* Indicador de Zoom */}
        <button 
          className="text-[#b3b3b3] text-xs font-normal whitespace-pre cursor-pointer hover:text-[#d9d9d9] transition-colors"
          onClick={onZoomReset}
          title="Reset Zoom (100%)"
          aria-label={`Reset zoom to 100%. Current zoom: ${percentage}%`}
        >
          {percentage}%
        </button>

        {/* Botão Zoom Out */}
        <button
          onClick={onZoomOut}
          disabled={!canZoomOut}
          className={`w-6 h-6 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors ${
            !canZoomOut ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Zoom Out (-)"
          aria-label={`Zoom out. Current zoom: ${percentage}%`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 18 4">
            <path d="M2 2H16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
