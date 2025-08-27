"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { CardBase } from "./CardBase";
import { CardData, Position } from "@/types/board";

type ImageCardProps = {
  card: CardData;
  onPositionChange: (cardId: string, newPosition: Position) => void;
  onSizeChange?: (cardId: string, width: number, height: number) => void;
  onSelectCard?: (cardId: string, isCtrlPressed: boolean) => void;
  isSelected?: boolean;
  className?: string;
};

export function ImageCard({ 
  card, 
  onPositionChange, 
  onSizeChange, 
  onSelectCard,
  isSelected: propIsSelected = false,
  className 
}: ImageCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSelected, setIsSelected] = useState(propIsSelected);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Sincronizar estado local com prop externa
  useEffect(() => {
    setIsSelected(propIsSelected);
  }, [propIsSelected]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Se clicar no card (não na imagem), selecionar
    if (e.target !== imageRef.current && !isDragging) {
      if (onSelectCard) {
        onSelectCard(card.id, e.ctrlKey || e.metaKey);
      }
      e.stopPropagation();
    }
  }, [isDragging, onSelectCard, card.id]);

  // Dimensões padrão se não estiverem definidas
  const defaultWidth = 200;
  const defaultHeight = 150;
  
  const cardWidth = card.width || defaultWidth;
  const cardHeight = card.height || defaultHeight;

  // Limites de tamanho
  const minWidth = 100;
  const maxWidth = 800;
  const minHeight = 100;
  const maxHeight = 600;
  const increment = 50;

  // Extract image data from card content (URL) and metadata
  const imageUrl = card.content;
  const fileName = typeof card.metadata?.fileName === 'string' ? card.metadata.fileName : 'Imagem';
  const fileSize = typeof card.metadata?.fileSize === 'string' ? card.metadata.fileSize : '';

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Se clicou em um botão de redimensionamento, não iniciar drag
    if ((e.target as HTMLElement).closest('.resize-button')) {
      return;
    }
    
    setIsDragging(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const dragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      const handleMouseMove = (e: MouseEvent) => {
        const newPosition: Position = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        onPositionChange(card.id, newPosition);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    e.preventDefault();
  }, [card.id, onPositionChange]);

  // Função para aumentar o tamanho
  const handleIncreaseSize = useCallback(() => {
    if (!onSizeChange) return;
    
    const newWidth = Math.min(maxWidth, cardWidth + increment);
    const newHeight = Math.min(maxHeight, cardHeight + increment);
    
    console.log('📏 Aumentando tamanho:', { 
      atual: { width: cardWidth, height: cardHeight }, 
      novo: { width: newWidth, height: newHeight } 
    });
    
    onSizeChange(card.id, newWidth, newHeight);
  }, [card.id, cardWidth, cardHeight, onSizeChange, maxWidth, maxHeight, increment]);

  // Função para diminuir o tamanho
  const handleDecreaseSize = useCallback(() => {
    if (!onSizeChange) return;
    
    const newWidth = Math.max(minWidth, cardWidth - increment);
    const newHeight = Math.max(minHeight, cardHeight - increment);
    
    console.log('📏 Diminuindo tamanho:', { 
      atual: { width: cardWidth, height: cardHeight }, 
      novo: { width: newWidth, height: newHeight } 
    });
    
    onSizeChange(card.id, newWidth, newHeight);
  }, [card.id, cardWidth, cardHeight, onSizeChange, minWidth, minHeight, increment]);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatFileSize = (size: string) => {
    if (!size) return '';
    const bytes = parseInt(size);
    if (isNaN(bytes)) return size;
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };

  return (
    <CardBase 
      ref={cardRef}
      className={`image-card ${className ?? ""} ${isDragging ? 'z-50 shadow-2xl scale-105 dragging' : 'z-10'} ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-80' : ''} !border-0 !p-0 !shadow-none`}
      style={{
        position: 'absolute',
        left: card.position.x,
        top: card.position.y,
        width: cardWidth,
        height: cardHeight,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transition: isDragging ? 'none' : 'all 0.3s ease'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleCardClick}
    >
      <div className="relative w-full h-full overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-sm text-center px-4">
              Erro ao carregar imagem
            </div>
          </div>
        ) : (
          <img
            ref={imageRef}
            src={imageUrl}
            alt={fileName}
            className="w-full h-full object-cover"
            onError={handleImageError}
            draggable={false}
          />
        )}
        
        {/* Overlay sutil com informações da imagem */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="text-xs">
            <div className="font-medium truncate">{fileName}</div>
            {fileSize && (
              <div className="text-xs opacity-80">
                {formatFileSize(fileSize)}
              </div>
            )}
          </div>
        </div>
        
        {/* Botões de redimensionamento */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 hover:opacity-100 transition-opacity duration-200">
          {/* Botão de aumentar */}
          <button
            className="resize-button w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 shadow-lg"
            onClick={handleIncreaseSize}
            disabled={cardWidth >= maxWidth && cardHeight >= maxHeight}
            title="Aumentar tamanho (+50px)"
          >
            +
          </button>
          
          {/* Botão de diminuir */}
          <button
            className="resize-button w-6 h-6 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDecreaseSize}
            disabled={cardWidth <= minWidth && cardHeight <= minHeight}
            title="Diminuir tamanho (-50px)"
          >
            −
          </button>
        </div>
        
        {/* Indicador de tamanho atual */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200">
          {cardWidth} × {cardHeight}
        </div>
      </div>
    </CardBase>
  );
}
