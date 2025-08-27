"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Mouse, Zap } from "lucide-react";

interface ShortcutsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = {
  "Navegação": [
    { key: "WASD", description: "Mover canvas" },
    { key: "Escape", description: "Limpar seleção" },
    { key: "Delete", description: "Remover cards selecionados" },
    { key: "Ctrl + Scroll", description: "Zoom no ponto do mouse" },
    { key: "Scroll", description: "Pan vertical" },
    { key: "Middle-click", description: "Pan do canvas" },
    { key: "Click + Drag", description: "Seleção por área" },
  ],
  "Seleção": [
    { key: "Click", description: "Selecionar card" },
    { key: "Ctrl + Click", description: "Seleção múltipla" },
    { key: "Click + Drag", description: "Seleção por área" },
  ],
  "Ações": [
    { key: "Ctrl + N", description: "Novo card" },
    { key: "Ctrl + D", description: "Duplicar card" },
    { key: "Ctrl + Z", description: "Desfazer" },
    { key: "Ctrl + Y", description: "Refazer" },
    { key: "Ctrl + F", description: "Buscar" },
    { key: "Ctrl + G", description: "Ir para card" },
  ],
  "Zoom": [
    { key: "+", description: "Zoom in" },
    { key: "-", description: "Zoom out" },
    { key: "0", description: "Reset zoom" },
    { key: "F11", description: "Modo foco" },
  ],
  "Ferramentas": [
    { key: "F1", description: "Ajuda e atalhos" },
    { key: "F2", description: "Configurações desktop" },
    { key: "G", description: "Toggle snap-to-grid" },
    { key: "F11", description: "Toggle modo foco" },
  ],
};

export function ShortcutsOverlay({ isOpen, onClose }: ShortcutsOverlayProps) {
  // Fechar com Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Keyboard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Atalhos de Teclado</h2>
                <p className="text-gray-600">Acelere seu fluxo de trabalho</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(shortcuts).map(([category, categoryShortcuts]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {category === "Navegação" && <Mouse className="w-5 h-5 text-blue-600" />}
                    {category === "Seleção" && <Zap className="w-5 h-5 text-green-600" />}
                    {category === "Ações" && <Keyboard className="w-5 h-5 text-purple-600" />}
                    {category === "Zoom" && <Zap className="w-5 h-5 text-orange-600" />}
                    {category === "Ferramentas" && <Keyboard className="w-5 h-5 text-indigo-600" />}
                    <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {categoryShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{shortcut.description}</span>
                        <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-sm font-mono text-gray-800 shadow-sm">
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Dica */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-blue-100 rounded">
                  <Keyboard className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Dica Pro</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    Use <kbd className="px-1 py-0.5 bg-white border border-blue-300 rounded text-xs">F1</kbd> para abrir este overlay a qualquer momento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
