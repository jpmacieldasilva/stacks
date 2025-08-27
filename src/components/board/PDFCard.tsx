"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { CardBase } from "./CardBase";
import { CardData, Position } from "@/types/board";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";

type PDFCardProps = {
  card: CardData;
  onPositionChange: (cardId: string, newPosition: Position) => void;
  onSelectCard?: (cardId: string, isCtrlPressed: boolean) => void;
  isSelected?: boolean;
  className?: string;
};

export function PDFCard({ 
  card, 
  onPositionChange, 
  onSelectCard,
  isSelected: propIsSelected = false,
  className 
}: PDFCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isSelected, setIsSelected] = useState(propIsSelected);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Sincronizar estado local com prop externa
  useEffect(() => {
    setIsSelected(propIsSelected);
  }, [propIsSelected]);

  // Extract PDF data from card content (URL) and metadata
  const pdfUrl = card.content;
  const fileName = typeof card.metadata?.fileName === 'string' ? card.metadata.fileName : 'Documento PDF';
  const fileSize = typeof card.metadata?.fileSize === 'string' ? card.metadata.fileSize : '';
  const pageCount = typeof card.metadata?.pageCount === 'number' ? card.metadata.pageCount : null;

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

  const handleMouseMove = useCallback((e: MouseEvent) => {
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

  const handleOpenPDF = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleClosePDF = () => {
    setIsModalOpen(false);
  };

  const formatFileSize = (size: string) => {
    if (!size) return '';
    const bytes = parseInt(size);
    if (isNaN(bytes)) return size;
    
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };

  const getDisplayName = () => {
    if (fileName.endsWith('.pdf')) {
      return fileName.slice(0, -4);
    }
    return fileName;
  };

  const getFileInfo = () => {
    const parts = [];
    parts.push('PDF');
    if (fileSize) {
      parts.push(formatFileSize(fileSize));
    }
    return parts.join(' | ');
  };

  return (
    <>
      <CardBase 
        ref={cardRef}
        className={`figma-paper pdf-card ${className ?? ""} ${isDragging ? 'z-50 shadow-2xl scale-105' : 'z-10'}`}
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
      >
        {/* Título do PDF - seguindo o design do Figma */}
        <div className="figma-paper-title-view-only">
          {getDisplayName()}
        </div>
        
        {/* Informações do arquivo - formato e tamanho */}
        <div className="figma-paper-content-view-only">
          {getFileInfo()}
        </div>
        
        {/* Botão para abrir PDF - posicionado absolutamente como no Paper */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenPDF}
          className="absolute top-4 right-4 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 bg-white/80 backdrop-blur-sm rounded-full"
          title="Abrir PDF"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </CardBase>

      {/* Modal para visualização do PDF - melhorado */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClosePDF}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">📄</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{fileName}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {pageCount && <span>{pageCount} páginas</span>}
                    {fileSize && <span>{formatFileSize(fileSize)}</span>}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClosePDF}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              >
                ✕
              </Button>
            </div>
            
            {/* Conteúdo do PDF */}
            <div className="flex-1 h-full">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full border-0"
                title={fileName}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
