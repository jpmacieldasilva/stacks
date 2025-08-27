"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CardBase } from "./CardBase";
import { CardData, Position } from "@/types/board";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

type PaperProps = {
  card: CardData;
  onPositionChange: (cardId: string, newPosition: Position) => void;
  onSelectCard?: (cardId: string, isCtrlPressed: boolean) => void;
  isSelected?: boolean;
  className?: string;
};

export function Paper({ 
  card, 
  onPositionChange, 
  onSelectCard,
  isSelected: propIsSelected = false,
  className 
}: PaperProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(propIsSelected);
  
  // Dados mock para visualização no canvas - ajustados para o design do Figma
  const title = "Tutorial visual rápido mostrando as possibilidades";
  const content = "Essas features são polidas, centradas no usuário e aprimoram diretamente a produtividade e a sensação de controle em ferramentas de design, diagramação ou organização visual. Se sua aplicação é um editor visual (como está sugerido pelo contexto), essas propostas vão alinhar seu produto ao estado da arte do UX/UI para esse segmento.";
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Sincronizar estado local com prop externa
  useEffect(() => {
    setIsSelected(propIsSelected);
  }, [propIsSelected]);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Se clicar no card, selecionar
    if (!isDragging) {
      if (onSelectCard) {
        onSelectCard(card.id, e.ctrlKey || e.metaKey);
      }
      e.stopPropagation();
    }
  }, [isDragging, onSelectCard, card.id]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (isDragging && cardRef.current) {
      const newPosition: Position = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      onPositionChange(card.id, newPosition);
    }
  }, [isDragging, dragOffset, card.id, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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

  const handleEnterFullscreen = () => {
    router.push(`/paper/${card.id}`);
  };

  return (
    <CardBase 
      ref={cardRef}
      className={`figma-paper ${className ?? ""} ${isDragging ? 'z-50 shadow-2xl scale-105' : 'z-10'}`}
      style={{
        position: 'absolute',
        left: card.position.x,
        top: card.position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        // Otimização: remover transições durante o dragging para melhor performance
        transition: isDragging ? 'none' : 'all 0.2s ease',
        // Otimização: usar transform3d para aceleração de hardware
        transform: isDragging ? 'scale(1.05) translateZ(0)' : 'translateZ(0)',
        willChange: isDragging ? 'transform' : 'auto'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleCardClick}
    >
      {/* Título principal - Apenas visualização no canvas */}
      <div className="figma-paper-title figma-paper-title-view-only">
        {title}
      </div>
      
      {/* Conteúdo - Apenas visualização no canvas */}
      <div className="figma-paper-content figma-paper-content-view-only">
        {content}
      </div>
      
      {/* Botão para modo tela cheia - posicionado absolutamente */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEnterFullscreen}
        className="absolute top-4 right-4 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 bg-white/80 backdrop-blur-sm rounded-full"
        title="Modo tela cheia"
      >
        <Maximize2 className="w-4 h-4" />
      </Button>
    </CardBase>
  );
}