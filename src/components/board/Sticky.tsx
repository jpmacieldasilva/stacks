"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { CardData, Position } from "@/types/board";
import { CardBase } from "./CardBase";
import { Tag } from "@/components/ui/Tag";
import { useBoardContext } from "@/contexts/BoardContext";

type StickyProps = {
  card: CardData;
  onContentChange?: (content: string) => void;
  onPositionChange?: (cardId: string, position: Position) => void;
  onRemoveCard?: (cardId: string) => void;
  onDuplicateCard?: (card: CardData) => void;
  onUpdateCardColor?: (cardId: string, color: CardData['color']) => void;
  onSelectCard?: (cardId: string, isCtrlPressed: boolean) => void;
  isSelected?: boolean;
  className?: string;
};

export function Sticky({
  card,
  onContentChange,
  onPositionChange,
  onRemoveCard,
  onDuplicateCard,
  onUpdateCardColor,
  onSelectCard,
  isSelected: propIsSelected = false,
  className
}: StickyProps) {
  const { boardState } = useBoardContext();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(14);
  const [isSelected, setIsSelected] = useState(propIsSelected);
  const cardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sincronizar estado local com prop externa
  useEffect(() => {
    setIsSelected(propIsSelected);
  }, [propIsSelected]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Se clicar no card (não no textarea), selecionar
    if (e.target !== textareaRef.current && !isDragging) {
      if (onSelectCard) {
        onSelectCard(card.id, e.ctrlKey || e.metaKey);
      }
      // Remover foco do textarea quando clicar no card
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
      e.stopPropagation();
    }
  }, [isDragging, onSelectCard, card.id]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== textareaRef.current) {
      setIsDragging(true);
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      e.preventDefault();
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && onPositionChange) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onPositionChange(card.id, { x: newX, y: newY });
    }
  }, [isDragging, dragOffset, onPositionChange, card.id]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (onContentChange) {
      onContentChange(newContent);
    }
  };

  const handleTextareaBlur = useCallback(() => {
    // Quando o textarea perde o foco, deselecionar o card
    if (onSelectCard) {
      onSelectCard(card.id, false);
    }
  }, [onSelectCard, card.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onSelectCard) {
        onSelectCard(card.id, e.ctrlKey || e.metaKey);
      }
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (onRemoveCard) {
        e.preventDefault();
        onRemoveCard(card.id);
      }
    }
    if (e.key === 'Escape') {
      if (onSelectCard) {
        onSelectCard(card.id, false);
      }
    }
  }, [onRemoveCard, onSelectCard, card.id]);

  // Ajustar tamanho da fonte baseado no conteúdo
  const adjustFontSize = useCallback(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const cardSize = card.size || 'md';
      
      // Definir tamanhos base para cada tamanho de card
      const baseSizes = {
        sm: { maxFont: 16, minFont: 10 },
        md: { maxFont: 18, minFont: 12 },
        lg: { maxFont: 22, minFont: 14 }
      };
      
      const { maxFont, minFont } = baseSizes[cardSize];
      let currentFont = maxFont;
      
      // Reduzir a fonte até que o texto caiba
      while (currentFont > minFont) {
        textarea.style.fontSize = `${currentFont}px`;
        if (textarea.scrollHeight <= textarea.clientHeight) {
          break;
        }
        currentFont -= 1;
      }
      
      setFontSize(currentFont);
    }
  }, [card.size]);

  useEffect(() => {
    adjustFontSize();
  }, [card.content, card.size, adjustFontSize]);

  const getSizeClass = () => {
    switch (card.size) {
      case 'sm': return 'w-28 h-28';
      case 'lg': return 'w-48 h-48';
      default: return 'w-36 h-36';
    }
  };

  const getColorClass = () => {
    switch (card.color) {
      case 'pink': return 'sticky-pink';
      case 'yellow': return 'sticky-yellow';
      case 'green': return 'sticky-green';
      case 'purple': return 'sticky-purple';
      case 'blue': return 'sticky-blue';
      case 'orange': return 'sticky-orange';
      default: return 'sticky-yellow';
    }
  };

  const colorClass = getColorClass();
  const sizeClass = getSizeClass();

  // Obter tags do card (apenas se existirem)
  const cardTags = card.tags ? card.tags
    .map(tagId => boardState.tags.find(tag => tag.id === tagId))
    .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined)
    : [];

  return (
    <div
      style={{
        position: 'absolute',
        left: card.position.x,
        top: card.position.y,
        zIndex: isDragging ? 50 : 10
      }}
    >
      <CardBase 
        ref={cardRef}
        className={`sticky-note group ${colorClass} ${sizeClass} ${className ?? ""} ${isDragging ? 'z-50 shadow-lg scale-105 dragging' : 'z-10'} ${isSelected ? 'card-selected' : ''}`}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          // Otimização: usar transform3d para aceleração de hardware
          transform: isDragging ? 'scale(1.05) translateZ(0)' : 'translateZ(0)',
          willChange: isDragging ? 'transform' : 'auto'
        }}
        onMouseDown={handleMouseDown}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        aria-label={`Sticky note: ${card.content || 'empty'}`}
        aria-selected={isSelected}
        role="button"
      >
        <div className="sticky-content">
          <textarea
            ref={textareaRef}
            value={card.content}
            onChange={handleContentChange}
            onBlur={handleTextareaBlur}
            className="flex-1 bg-transparent border-none outline-none resize-none overflow-hidden"
            placeholder="Digite sua nota..."
            style={{ 
              fontSize: '16px',
              lineHeight: 'normal',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: 400
            }}
            onInput={adjustFontSize}
          />
          
          {/* Tags */}
          {cardTags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {cardTags.slice(0, 2).map((tag) => (
                <Tag key={tag.id} tag={tag} />
              ))}
              {cardTags.length > 2 && (
                <span className="text-xs text-gray-500">+{cardTags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </CardBase>
    </div>
  );
}
