"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardData } from "@/types/board";

type FloatingToolbarProps = {
  isVisible: boolean;
  cardRef: React.RefObject<HTMLDivElement>;
  card: CardData;
  isSelected?: boolean;
  onAddTags: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onChangeColor: (color: CardData['color']) => void;
  onClose: () => void;
};

export function FloatingToolbar({
  isVisible,
  cardRef,
  card,
  isSelected = false,
  onAddTags,
  onDelete,
  onDuplicate,
  onChangeColor,
  onClose
}: FloatingToolbarProps) {
  const colors: CardData['color'][] = ['pink', 'yellow', 'green', 'purple', 'blue', 'orange'];

  const getColorClass = (color: CardData['color']) => {
    switch (color) {
      case 'pink': return 'bg-pink-200 hover:bg-pink-300';
      case 'yellow': return 'bg-yellow-200 hover:bg-yellow-300';
      case 'green': return 'bg-green-200 hover:bg-green-300';
      case 'purple': return 'bg-purple-200 hover:bg-purple-300';
      case 'blue': return 'bg-blue-200 hover:bg-blue-300';
      case 'orange': return 'bg-orange-200 hover:bg-orange-300';
      default: return 'bg-yellow-200 hover:bg-yellow-300';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay invisível para detectar cliques fora */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          
          {/* Barra de ferramentas */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-2"
            style={{
              left: cardRef.current ? cardRef.current.getBoundingClientRect().left + (cardRef.current.offsetWidth / 2) : 0,
              top: cardRef.current ? cardRef.current.getBoundingClientRect().top - 60 : 0, // 60px acima do card
              transform: 'translateX(-50%)', // Centralizar horizontalmente
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              {/* Indicador de seleção múltipla */}
              {isSelected && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded text-xs text-blue-700 font-medium border border-blue-200">
                  ✓ Selecionado
                </div>
              )}
              
              {/* Botão de Tags */}
              <button
                onClick={onAddTags}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
                title="Adicionar tags"
              >
                <span className="text-sm">🏷️</span>
              </button>

              <div className="w-px h-6 bg-gray-200" />

              {/* Seletor de Cores */}
              <div className="flex items-center gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onChangeColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      card.color === color 
                        ? 'border-gray-400 scale-110' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${getColorClass(color)}`}
                    title={`Cor ${color}`}
                  />
                ))}
              </div>

              <div className="w-px h-6 bg-gray-200" />

              {/* Botão Duplicar */}
              <button
                onClick={onDuplicate}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
                title="Duplicar"
              >
                <span className="text-sm">📋</span>
              </button>

              {/* Botão Excluir */}
              <button
                onClick={onDelete}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                title="Excluir"
              >
                <span className="text-sm">🗑️</span>
              </button>
            </div>

            {/* Setinha apontando para o card */}
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2"
              style={{ marginTop: '-1px' }}
            >
              <div className="w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
