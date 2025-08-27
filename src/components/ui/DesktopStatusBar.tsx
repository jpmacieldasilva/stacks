"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./Icon";

interface DesktopStatusBarProps {
  isSnapToGrid: boolean;
  gridSize: number;
  isFocusMode: boolean;
  selectedCardsCount: number;
  viewportScale: number;
  totalCards: number;
}

export function DesktopStatusBar({
  isSnapToGrid,
  gridSize,
  isFocusMode,
  selectedCardsCount,
  viewportScale,
  totalCards
}: DesktopStatusBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-5 left-5 z-30 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 px-4 py-3"
    >
      <div className="flex items-center gap-6 text-sm">
        {/* Status do Grid */}
        <div className="flex items-center gap-2">
          <Icon 
            name="grid" 
            size={16} 
            className={isSnapToGrid ? "text-blue-600" : "text-gray-400"} 
          />
          <span className={`font-medium ${isSnapToGrid ? "text-blue-700" : "text-gray-500"}`}>
            {isSnapToGrid ? `Grid ${gridSize}px` : "Grid Off"}
          </span>
        </div>

        {/* Status do Modo Foco */}
        <div className="flex items-center gap-2">
          <Icon 
            name={isFocusMode ? "eyeOff" : "eye"} 
            size={16} 
            className={isFocusMode ? "text-orange-600" : "text-gray-400"} 
          />
          <span className={`font-medium ${isFocusMode ? "text-orange-700" : "text-gray-500"}`}>
            {isFocusMode ? "Foco" : "Normal"}
          </span>
        </div>

        {/* Contador de Cards Selecionados */}
        {selectedCardsCount > 0 && (
          <div className="flex items-center gap-2">
            <Icon name="checkCircle" size={16} className="text-green-600" />
            <span className="font-medium text-green-700">
              {selectedCardsCount} selecionado(s)
            </span>
          </div>
        )}

        {/* Zoom */}
        <div className="flex items-center gap-2">
          <Icon name="search" size={16} className="text-gray-600" />
          <span className="font-medium text-gray-700">
            {Math.round(viewportScale * 100)}%
          </span>
        </div>

        {/* Total de Cards */}
        <div className="flex items-center gap-2">
          <Icon name="fileText" size={16} className="text-gray-600" />
          <span className="font-medium text-gray-700">
            {totalCards} card(s)
          </span>
        </div>

        {/* Separador */}
        <div className="w-px h-4 bg-gray-300" />

        {/* Dicas Rápidas */}
        <div className="flex items-center gap-2 text-gray-500">
          <Icon name="keyboard" size={14} className="text-gray-400" />
          <span className="text-xs">
            F1: Ajuda • F2: Config • F11: Foco • G: Grid
          </span>
        </div>
      </div>
    </motion.div>
  );
}
