"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { CardData, Position } from "@/types/board";

type LinkCardProps = {
  card: CardData;
  onPositionChange: (cardId: string, newPosition: Position) => void;
  onSelectCard?: (cardId: string, isCtrlPressed: boolean) => void;
  isSelected?: boolean;
  className?: string;
};

type LinkMetadata = {
  title: string;
  description: string;
  thumbnail: string;
  favicon: string;
};

export function LinkCard({ 
  card, 
  onPositionChange, 
  onSelectCard,
  isSelected: propIsSelected = false,
  className 
}: LinkCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [thumbnailError, setThumbnailError] = useState(false);
  const [isSelected, setIsSelected] = useState(propIsSelected);
  const [metadata, setMetadata] = useState<LinkMetadata>({
    title: 'Carregando...',
    description: '',
    thumbnail: '',
    favicon: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Sincronizar estado local com prop externa
  useEffect(() => {
    setIsSelected(propIsSelected);
  }, [propIsSelected]);

  // Extract link data from card content (URL)
  const url = card.content;

  // Função para extrair metadados do link
  const extractLinkMetadata = useCallback(async (url: string) => {
    try {
      setIsLoading(true);
      
      // Tentar extrair favicon do domínio
      const domain = new URL(url).hostname;
      const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      
      // Para links externos, tentar extrair metadados via proxy ou API
      // Como não temos uma API de metadados, vamos usar uma abordagem alternativa
      
      // Simular extração de metadados baseada no domínio
      let title = 'Link';
      let description = '';
      let thumbnail = '';
      
      // Tentar obter metadados via Open Graph ou meta tags
      try {
        // Usar um proxy CORS para acessar a página
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
          const html = data.contents;
          
          // Extrair título
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch) {
            title = titleMatch[1].trim();
          }
          
          // Extrair descrição
          const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
          if (descMatch) {
            description = descMatch[1].trim();
          }
          
          // Extrair Open Graph image
          const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
          if (ogImageMatch) {
            thumbnail = ogImageMatch[1].trim();
          }
        }
      } catch (error) {
        console.log('Erro ao extrair metadados:', error);
      }
      
      // Fallback: usar informações do domínio
      if (title === 'Link') {
        title = domain.replace('www.', '');
      }
      
      if (!description) {
        description = `Link para ${domain}`;
      }
      
      if (!thumbnail) {
        // Usar um placeholder baseado no domínio
        thumbnail = `https://via.placeholder.com/320x200/667eea/ffffff?text=${encodeURIComponent(domain)}`;
      }
      
      setMetadata({
        title,
        description,
        thumbnail,
        favicon
      });
      
    } catch (error) {
      console.log('Erro ao processar link:', error);
      // Fallback com informações básicas
      const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
      setMetadata({
        title: domain,
        description: `Link para ${domain}`,
        thumbnail: `https://via.placeholder.com/320x200/667eea/ffffff?text=${encodeURIComponent(domain)}`,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Extrair metadados quando o componente montar
  useEffect(() => {
    if (url) {
      extractLinkMetadata(url);
    }
  }, [url, extractLinkMetadata]);

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
    if ((e.target as HTMLElement).tagName === 'BUTTON') return;
    
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

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleThumbnailError = () => {
    setThumbnailError(true);
    // Usar placeholder quando a imagem falhar
    setMetadata(prev => ({
      ...prev,
      thumbnail: `https://via.placeholder.com/320x200/667eea/ffffff?text=${encodeURIComponent(prev.title)}`
    }));
  };

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      ref={cardRef}
      className={`link-card-fixed ${className ?? ""} ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: card.position.x,
        top: card.position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        // Otimização: remover transições durante o dragging para melhor performance
        transition: isDragging ? 'none' : 'all 0.2s ease',
        // Otimização: usar transform3d para aceleração de hardware
        transform: isDragging ? 'translateZ(0)' : 'translateZ(0)',
        willChange: isDragging ? 'transform' : 'auto',
        width: '320px',
        height: '200px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}
    >
      {/* Loading indicator */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.1)',
          zIndex: 10
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}
      
      {/* Thumbnail ou Placeholder */}
      {metadata.thumbnail && !thumbnailError ? (
        <img
          src={metadata.thumbnail}
          alt={metadata.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 'inherit',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          onError={handleThumbnailError}
          draggable={false}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          position: 'absolute',
          top: 0,
          left: 0
        }}>
          🔗
        </div>
      )}
      
      {/* Overlay sempre visível com informações */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
        color: 'white',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '1.2',
            textShadow: '0 1px 2px rgba(0,0,0,0.7)',
            color: 'white'
          }}>
            {metadata.title}
          </div>
          
          {metadata.description && (
            <div style={{
              fontSize: '13px',
              lineHeight: '1.3',
              opacity: '0.9',
              textShadow: '0 1px 2px rgba(0,0,0,0.7)',
              color: 'white',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxHeight: 'calc(1.3em * 2)'
            }}>
              {metadata.description}
            </div>
          )}
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            opacity: '0.8',
            textShadow: '0 1px 2px rgba(0,0,0,0.7)',
            color: 'white'
          }}>
            {metadata.favicon && (
              <img
                src={metadata.favicon}
                alt=""
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '2px'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span style={{
              fontFamily: 'SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, Courier New, monospace'
            }}>
              {getDomain(url)}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleLinkClick}
          style={{
            background: 'rgba(255,255,255,0.9)',
            color: '#1f2937',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
          title="Abrir link"
        >
          Abrir ↗
        </button>
      </div>
    </div>
  );
}
