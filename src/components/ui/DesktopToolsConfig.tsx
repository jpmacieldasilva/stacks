"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Grid, Mouse, Keyboard, Eye, EyeOff } from "lucide-react";

interface DesktopToolsConfigProps {
  isOpen: boolean;
  onClose: () => void;
  isSnapToGrid: boolean;
  onToggleSnapToGrid: () => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export function DesktopToolsConfig({
  isOpen,
  onClose,
  isSnapToGrid,
  onToggleSnapToGrid,
  gridSize,
  onGridSizeChange,
  isFocusMode,
  onToggleFocusMode
}: DesktopToolsConfigProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed top-20 right-5 z-40 bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-80"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configurações Desktop</h3>
              <p className="text-sm text-gray-600">Otimize sua experiência</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Grid Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Grid className="w-5 h-5 text-gray-600" />
              <div>
                <h4 className="font-medium text-gray-900">Snap-to-Grid</h4>
                <p className="text-sm text-gray-600">Alinhar cards ao grid</p>
              </div>
            </div>
            <button
              onClick={onToggleSnapToGrid}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isSnapToGrid ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isSnapToGrid ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isSnapToGrid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <label className="block text-sm font-medium text-gray-700">
                Tamanho do Grid
              </label>
              <div className="flex gap-2">
                {[10, 20, 40, 80].map((size) => (
                  <button
                    key={size}
                    onClick={() => onGridSizeChange(size)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      gridSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Focus Mode */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {isFocusMode ? (
                <EyeOff className="w-5 h-5 text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600" />
              )}
              <div>
                <h4 className="font-medium text-gray-900">Modo Foco</h4>
                <p className="text-sm text-gray-600">Ocultar painéis (F11)</p>
              </div>
            </div>
            <button
              onClick={onToggleFocusMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isFocusMode ? 'bg-orange-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isFocusMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">Atalhos Rápidos</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-800">G</span>
              <span className="text-blue-700">Toggle Grid</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">F11</span>
              <span className="text-blue-700">Toggle Foco</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-800">F1</span>
              <span className="text-blue-700">Ajuda</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
