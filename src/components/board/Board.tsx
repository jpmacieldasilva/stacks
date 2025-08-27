"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sticky } from "./Sticky";
import { Paper } from "./Paper";
import { ImageCard } from "./ImageCard";
import { PDFCard } from "./PDFCard";
import { LinkCard } from "./LinkCard";


import { useBoardContext } from "@/contexts/BoardContext";
import { useCanvas } from "@/contexts/CanvasContext";
import { Position, CardData } from "@/types/board";
import { Header } from "@/components/layout/Header";
import { ZoomControls } from "./ZoomControls";
import { Minimap } from "./Minimap";
import { UploadProgress } from "./UploadProgress";
import { ActionBar } from "./ActionBar";
import { ChatPanel } from "./ChatPanel";
import { useToast } from "@/components/ui/Toast";
import { ShortcutsOverlay } from "@/components/ui/ShortcutsOverlay";
import { DesktopToolsConfig } from "@/components/ui/DesktopToolsConfig";
import { DesktopStatusBar } from "@/components/ui/DesktopStatusBar";
import { GridOverlay } from "@/components/ui/GridOverlay";


export function Board() {
  const router = useRouter();
  const { 
    boardState, 
    searchState,
    uploadState,
    updateCardContent, 
    updateCardTitle,
    updateCardPosition, 
    updateCardSize,
    addFileCard,
    removeCard,
    duplicateCard,
    updateCardColor,
    getFilteredAndHighlightedCards
  } = useBoardContext();

  // Sistema de notificações toast
  const { showSuccess, showError, showInfo } = useToast();

  // Usar o contexto do Canvas para gerenciar viewport
  const { updateCanvasState } = useCanvas();
  
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });

  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  // Lightbox state for image/pdf preview
  const [lightbox, setLightbox] = useState<{ open: boolean; type?: 'image' | 'pdf'; src?: string }>(
    { open: false }
  );

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Shortcuts overlay state
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  
  // Focus mode state
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  // Mouse navigation state
  const [isSnapToGrid, setIsSnapToGrid] = useState(false);
  const [gridSize, setGridSize] = useState(20); // 20px grid
  const [isSelectingArea, setIsSelectingArea] = useState(false);
  const [selectionArea, setSelectionArea] = useState<{
    start: Position;
    end: Position;
  } | null>(null);
  
  // Desktop tools config state
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);

  // Sincronizar viewport local com o contexto do Canvas
  useEffect(() => {
    updateCanvasState({
      zoom: viewport.scale,
      position: { x: viewport.x, y: viewport.y },
      scrollPosition: { x: viewport.x, y: viewport.y }
    });
  }, [viewport, updateCanvasState]);

  // Escutar evento para centralizar no paper
  useEffect(() => {
    const handleCenterOnPaper = (event: CustomEvent) => {
      const { paperId } = event.detail;
      const paper = boardState.cards.find(card => card.id === paperId);
      
      if (paper) {
        // Centralizar o viewport no paper
        const centerX = paper.position.x + 75; // Metade da largura do paper
        const centerY = paper.position.y + 50; // Metade da altura do paper
        
        const newViewport = {
          x: window.innerWidth / 2 - centerX * viewport.scale,
          y: window.innerHeight / 2 - centerY * viewport.scale,
          scale: viewport.scale
        };
        
        setViewport(newViewport);
        console.log('Canvas centralizado no paper:', paperId);
      }
    };

    window.addEventListener('centerOnPaper', handleCenterOnPaper as EventListener);
    
    return () => {
      window.removeEventListener('centerOnPaper', handleCenterOnPaper as EventListener);
    };
  }, [boardState.cards, viewport.scale]);



  // Funções para seleção múltipla
  const handleCardSelect = useCallback((cardId: string, isCtrlPressed: boolean) => {
    console.log('🔄 handleCardSelect chamado');
    console.log('🎯 Card ID:', cardId);
    console.log('⌨️ Ctrl pressionado:', isCtrlPressed);
    console.log('📊 Estado atual da seleção:', Array.from(selectedCards));
    
    if (isCtrlPressed) {
      setSelectedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(cardId)) {
          newSet.delete(cardId);
          console.log('❌ Card removido da seleção:', cardId);
        } else {
          newSet.add(cardId);
          console.log('✅ Card adicionado à seleção:', cardId);
        }
        console.log('🔄 Nova seleção (Ctrl):', Array.from(newSet));
        return newSet;
      });
    } else {
      setSelectedCards(new Set([cardId]));
      console.log('🔄 Nova seleção (único):', [cardId]);
    }
  }, [selectedCards]);

  const clearSelection = useCallback(() => {
    setSelectedCards(new Set());
  }, []);

  const handleBulkDelete = useCallback(() => {
    console.log('Deletando cards:', Array.from(selectedCards));
    const count = selectedCards.size;
    selectedCards.forEach(cardId => {
      console.log('Deletando card:', cardId);
      removeCard(cardId);
    });
    setSelectedCards(new Set());
    showSuccess(`${count} card(s) removido(s)`, "Cards deletados com sucesso");
  }, [selectedCards, removeCard, showSuccess]);

  const handleBulkColorChange = useCallback((color: CardData['color']) => {
    console.log('Mudando cor para:', color, 'em cards:', Array.from(selectedCards));
    const count = selectedCards.size;
    selectedCards.forEach(cardId => {
      console.log('Mudando cor do card:', cardId, 'para:', color);
      updateCardColor(cardId, color);
    });
    showInfo(`Cor alterada para ${count} card(s)`, `Cor aplicada: ${color}`);
  }, [selectedCards, updateCardColor, showInfo]);

  const handleBulkDuplicate = useCallback(() => {
    console.log('Duplicando cards:', Array.from(selectedCards));
    const count = selectedCards.size;
    selectedCards.forEach(cardId => {
      const card = boardState.cards.find(c => c.id === cardId);
      if (card) {
        console.log('Duplicando card:', card);
        duplicateCard(card);
      }
    });
    showSuccess(`${count} card(s) duplicado(s)`, "Cards duplicados com sucesso");
  }, [selectedCards, boardState.cards, duplicateCard, showSuccess]);

  // Função para navegação por teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Atalhos com Ctrl
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          // TODO: Implementar novo card
          showInfo("Novo Card", "Funcionalidade em desenvolvimento");
          break;
        case 'd':
          e.preventDefault();
          if (selectedCards.size > 0) {
            handleBulkDuplicate();
          }
          break;
        case 'z':
          e.preventDefault();
          // TODO: Implementar undo
          showInfo("Desfazer", "Funcionalidade em desenvolvimento");
          break;
        case 'y':
          e.preventDefault();
          // TODO: Implementar redo
          showInfo("Refazer", "Funcionalidade em desenvolvimento");
          break;
        case 'f':
          e.preventDefault();
          // TODO: Implementar busca
          showInfo("Buscar", "Funcionalidade em desenvolvimento");
          break;
        case 'g':
          e.preventDefault();
          // TODO: Implementar ir para card
          showInfo("Ir para Card", "Funcionalidade em desenvolvimento");
          break;
      }
      return;
    }

    // Atalhos especiais
    switch (e.key) {
      case 'F1':
        e.preventDefault();
        setIsShortcutsOpen(true);
        showInfo("Atalhos", "Overlay de atalhos aberto");
        break;
      case 'F11':
        e.preventDefault();
        setIsFocusMode(prev => !prev);
        showInfo(
          isFocusMode ? "Modo Normal" : "Modo Foco", 
          isFocusMode ? "Painéis restaurados" : "Painéis ocultos para foco total"
        );
        break;
      case 'G':
        e.preventDefault();
        setIsSnapToGrid(prev => !prev);
        showInfo(
          isSnapToGrid ? "Grid Desativado" : "Grid Ativado", 
          isSnapToGrid ? "Snap-to-grid desativado" : `Snap-to-grid ativado (${gridSize}px)`
        );
        break;
      case 'F2':
        e.preventDefault();
        setIsConfigOpen(prev => !prev);
        showInfo(
          isConfigOpen ? "Configurações fechadas" : "Configurações abertas", 
          "Painel de configurações desktop"
        );
        break;
    }

    // WASD para pan
    const panSpeed = 50;
    
    switch (e.key.toLowerCase()) {
      case 'w':
        e.preventDefault();
        setViewport(prev => ({ ...prev, y: prev.y + panSpeed }));
        showInfo("Navegação", "Movendo para cima (W)");
        break;
      case 's':
        e.preventDefault();
        setViewport(prev => ({ ...prev, y: prev.y - panSpeed }));
        showInfo("Navegação", "Movendo para baixo (S)");
        break;
      case 'a':
        e.preventDefault();
        setViewport(prev => ({ ...prev, x: prev.x + panSpeed }));
        showInfo("Navegação", "Movendo para esquerda (A)");
        break;
      case 'd':
        e.preventDefault();
        setViewport(prev => ({ ...prev, x: prev.x - panSpeed }));
        showInfo("Navegação", "Movendo para direita (D)");
        break;
      case 'escape':
        e.preventDefault();
        clearSelection();
        showInfo("Seleção limpa", "Pressione Escape para limpar seleção");
        break;
      case 'delete':
        e.preventDefault();
        if (selectedCards.size > 0) {
          handleBulkDelete();
        }
        break;
    }
  }, [clearSelection, selectedCards.size, handleBulkDelete, showInfo, handleBulkDuplicate]);

  // Event listener para navegação por teclado
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleContentChange = (cardId: string, content: string) => {
    updateCardContent(cardId, content);
  };

  const handleTitleChange = (cardId: string, title: string) => {
    updateCardTitle(cardId, title);
  };

  const handlePositionChange = (cardId: string, newPosition: Position) => {
    // Ajustar posição considerando o viewport
    let adjustedPosition = {
      x: (newPosition.x - viewport.x) / viewport.scale,
      y: (newPosition.y - viewport.y) / viewport.scale
    };
    
    // Aplicar snap-to-grid se ativado
    if (isSnapToGrid) {
      adjustedPosition = {
        x: Math.round(adjustedPosition.x / gridSize) * gridSize,
        y: Math.round(adjustedPosition.y / gridSize) * gridSize
      };
    }
    
    updateCardPosition(cardId, adjustedPosition);
  };



  const handleFileUpload = (file: File, position: Position) => {
    // Adjust position based on viewport
    const adjustedPosition = {
      x: (position.x - viewport.x) / viewport.scale,
      y: (position.y - viewport.y) / viewport.scale
    };
    addFileCard(file, adjustedPosition);
  };

  // Funções para drag & drop global no canvas
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // setDragCounter(prev => prev + 1); // Removed as per edit hint
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // setDragCounter(prev => { // Removed as per edit hint
    //   const newCounter = prev - 1;
    //   if (newCounter === 0) {
    //     setIsDragOverCanvas(false);
    //   }
    //   return newCounter;
    // });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // if (!isDragOverCanvas) { // Removed as per edit hint
    //   setIsDragOverCanvas(true);
    // }
  }, []); // Removed isDragOverCanvas dependency as it's no longer used

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // setIsDragOverCanvas(false); // Removed as per edit hint
    // setDragCounter(0); // Removed as per edit hint

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Obter posição do drop no centro da tela visível
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Converter para coordenadas do mundo
    const worldPosition = {
      x: (centerX - viewport.x) / viewport.scale,
      y: (centerY - viewport.y) / viewport.scale
    };

    // Adicionar todos os arquivos
    files.forEach(async (file, index) => {
      const offsetPosition = {
        x: worldPosition.x + (index * 20), // Pequeno offset para múltiplos arquivos
        y: worldPosition.y + (index * 20)
      };
      await addFileCard(file, offsetPosition);
    });
    
    showSuccess(`${files.length} arquivo(s) adicionado(s)`, "Arquivos processados com sucesso");
  }, [viewport, addFileCard, showSuccess]);

  // Funções específicas para cada tipo de card
  const handleViewFullscreen = useCallback(() => {
    const selectedCard = boardState.cards.find(c => c.id === Array.from(selectedCards)[0]);
    if (selectedCard?.type === 'image') {
      setLightbox({ open: true, type: 'image', src: selectedCard.content });
    }
  }, [selectedCards, boardState.cards]);

  const handleDownload = useCallback(() => {
    const selectedCard = boardState.cards.find(c => c.id === Array.from(selectedCards)[0]);
    if (selectedCard) {
      if (selectedCard.type === 'image' || selectedCard.type === 'pdf') {
        // Criar link de download
        const link = document.createElement('a');
        link.href = selectedCard.content;
        const fileName = typeof selectedCard.metadata?.fileName === 'string' 
          ? selectedCard.metadata.fileName 
          : `download.${selectedCard.type === 'image' ? 'jpg' : 'pdf'}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }, [selectedCards, boardState.cards]);

  const handleRotate = useCallback(() => {
    const selectedCard = boardState.cards.find(c => c.id === Array.from(selectedCards)[0]);
    if (selectedCard?.type === 'image') {
      // Implementar rotação da imagem (pode ser via CSS transform ou atualizando metadata)
      console.log('Rotacionar imagem:', selectedCard.id);
      // TODO: Implementar rotação real
    }
  }, [selectedCards, boardState.cards]);

  const handleOpenLink = useCallback(() => {
    const selectedCard = boardState.cards.find(c => c.id === Array.from(selectedCards)[0]);
    if (selectedCard?.type === 'link') {
      window.open(selectedCard.content, '_blank');
    }
  }, [selectedCards, boardState.cards]);

  const handleCopyLink = useCallback(() => {
    const selectedCard = boardState.cards.find(c => c.id === Array.from(selectedCards)[0]);
    if (selectedCard?.type === 'link') {
      navigator.clipboard.writeText(selectedCard.content);
      // TODO: Mostrar toast de confirmação
      console.log('Link copiado:', selectedCard.content);
    }
  }, [selectedCards, boardState.cards]);

  const handleViewPDF = useCallback(() => {
    const selectedCard = boardState.cards.find(c => c.id === Array.from(selectedCards)[0]);
    if (selectedCard?.type === 'pdf') {
      setLightbox({ open: true, type: 'pdf', src: selectedCard.content });
    }
  }, [selectedCards, boardState.cards]);

  const handleEditContent = useCallback(() => {
    const selectedCard = boardState.cards.find(c => c.id === Array.from(selectedCards)[0]);
    if (selectedCard?.type === 'paper') {
      router.push(`/paper/${selectedCard.id}`);
    }
  }, [selectedCards, boardState.cards, router]);

  const handleAddTag = useCallback(() => {
    const selectedCard = boardState.cards.find(c => c.id === Array.from(selectedCards)[0]);
    if (selectedCard) {
      // TODO: Implementar modal de adição de tags
      console.log('Adicionar tag para:', selectedCard.id);
    }
  }, [selectedCards, boardState.cards]);

  const renderCard = (card: CardData) => {
    const isHighlighted = searchState.highlightedCards.includes(card.id);
    const hasActiveSearch = searchState.query || searchState.typeFilters.length > 0 || searchState.tagFilters.length > 0;
    const shouldDim = hasActiveSearch && !isHighlighted;
    const searchClasses = [
      isHighlighted ? 'search-highlighted' : '',
      shouldDim ? 'search-dimmed' : ''
    ].filter(Boolean).join(' ');

    switch (card.type) {
      case 'sticky':
        return (
          <Sticky
            key={card.id}
            card={card}
            onContentChange={(content) => handleContentChange(card.id, content)}
            onPositionChange={handlePositionChange}
            onRemoveCard={removeCard}
            onDuplicateCard={duplicateCard}
            onUpdateCardColor={updateCardColor}
            onSelectCard={handleCardSelect}
            isSelected={selectedCards.has(card.id)}
            className={searchClasses}
          />
        );
      case 'paper':
        return (
          <Paper 
            key={card.id} 
            card={card} 
            onPositionChange={handlePositionChange}
            onSelectCard={handleCardSelect}
            isSelected={selectedCards.has(card.id)}
            className={searchClasses}
          />
        );
      case 'image':
        return (
          <ImageCard 
            key={card.id} 
            card={card} 
            onPositionChange={handlePositionChange}
            onSizeChange={updateCardSize}
            onSelectCard={handleCardSelect}
            isSelected={selectedCards.has(card.id)}
            className={searchClasses}
          />
        );
      case 'pdf':
        return (
          <PDFCard 
            key={card.id} 
            card={card} 
            onPositionChange={handlePositionChange}
            onSelectCard={handleCardSelect}
            isSelected={selectedCards.has(card.id)}
            className={searchClasses}
          />
        );
      case 'link':
        return (
          <LinkCard 
            key={card.id} 
            card={card} 
            onPositionChange={handlePositionChange}
            onSelectCard={handleCardSelect}
            isSelected={selectedCards.has(card.id)}
            className={searchClasses}
          />
        );
      default:
        return null;
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle click (button 1) para pan
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      return;
    }
    
    // Right click (button 2) - não fazer nada
    if (e.button === 2) return;
    
    // Left click (button 0) para seleção ou pan
    if (e.button === 0) {
      if (e.target === boardRef.current) {
        // Iniciar seleção por área
        const rect = boardRef.current.getBoundingClientRect();
        const worldPosition = {
          x: (e.clientX - rect.left - viewport.x) / viewport.scale,
          y: (e.clientY - rect.top - viewport.y) / viewport.scale
        };
        
        setIsSelectingArea(true);
        setSelectionArea({
          start: worldPosition,
          end: worldPosition
        });
        setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
        e.preventDefault();
      }
    }
  }, [viewport.x, viewport.y, viewport.scale]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setViewport(prev => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      }));
    }
    
    // Atualizar área de seleção
    if (isSelectingArea && selectionArea) {
      const rect = boardRef.current?.getBoundingClientRect();
      if (rect) {
        const worldPosition = {
          x: (e.clientX - rect.left - viewport.x) / viewport.scale,
          y: (e.clientY - rect.top - viewport.y) / viewport.scale
        };
        
        setSelectionArea(prev => prev ? {
          ...prev,
          end: worldPosition
        } : null);
      }
    }
  }, [isPanning, panStart, isSelectingArea, selectionArea, viewport.x, viewport.y, viewport.scale]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    
    // Finalizar seleção por área
    if (isSelectingArea && selectionArea) {
      const { start, end } = selectionArea;
      
      // Calcular área de seleção
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);
      
      // Selecionar cards dentro da área
      const selectedInArea = boardState.cards.filter(card => {
        const cardWidth = card.width || 150;
        const cardHeight = card.height || 100;
        const cardCenterX = card.position.x + cardWidth / 2;
        const cardCenterY = card.position.y + cardHeight / 2;
        
        return cardCenterX >= minX && cardCenterX <= maxX &&
               cardCenterY >= minY && cardCenterY <= maxY;
      });
      
      if (selectedInArea.length > 0) {
        const newSelection = new Set(selectedInArea.map(card => card.id));
        setSelectedCards(newSelection);
        showInfo(`Seleção por área`, `${selectedInArea.length} card(s) selecionado(s)`);
      }
      
      setIsSelectingArea(false);
      setSelectionArea(null);
    }
  }, [isSelectingArea, selectionArea, boardState.cards, showInfo]);

  // Registrar o event listener de wheel manualmente para evitar problemas com passive listeners
  React.useEffect(() => {
    const boardElement = boardRef.current;
    if (!boardElement) return;

    const wheelHandler = (e: WheelEvent) => {
      // Ctrl+scroll para zoom
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.05, Math.min(3, viewport.scale * delta)); // Consistente com controles
        
        // Zoom no ponto do mouse
        const rect = boardElement.getBoundingClientRect();
        if (rect) {
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          requestAnimationFrame(() => {
            setViewport(prev => ({
              x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
              y: mouseY - (mouseY - prev.y) * (newScale / prev.scale),
              scale: newScale
            }));
          });
        }
        return;
      }
      
      // Scroll normal para pan vertical
      e.preventDefault();
      e.stopPropagation();
      
      // Pan vertical com scroll
      const panSpeed = 50;
      const deltaY = e.deltaY;
      
      setViewport(prev => ({
        ...prev,
        y: prev.y - deltaY * panSpeed * 0.01
      }));
    };

    // Usar passive: false para permitir preventDefault
    boardElement.addEventListener('wheel', wheelHandler, { passive: false });
    
    return () => {
      boardElement.removeEventListener('wheel', wheelHandler);
    };
  }, [viewport.scale]);

  // Funções para controles de zoom
  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(3, viewport.scale * 1.2); // Aumentado para 3x
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      setViewport(prev => ({
        x: centerX - (centerX - prev.x) * (newScale / prev.scale),
        y: centerY - (centerY - prev.y) * (newScale / prev.scale),
        scale: newScale
      }));
    }
  }, [viewport]);

  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(0.05, viewport.scale * 0.8); // Reduzido para 0.05x
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      setViewport(prev => ({
        x: centerX - (centerX - prev.x) * (newScale / prev.scale),
        y: centerY - (centerY - prev.y) * (newScale / prev.scale),
        scale: newScale
      }));
    }
  }, [viewport]);

  const handleZoomReset = useCallback(() => {
    setViewport({ x: 0, y: 0, scale: 1 });
  }, []);

  React.useEffect(() => {
    if (isPanning) {
      let animationFrameId: number;
      
      const handleMouseMove = (e: MouseEvent) => {
        if (isPanning) {
          // Usar requestAnimationFrame para suavizar o panning
          animationFrameId = requestAnimationFrame(() => {
            setViewport(prev => ({
              ...prev,
              x: e.clientX - panStart.x,
              y: e.clientY - panStart.y
            }));
          });
        }
      };

      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, panStart, handleMouseUp]);

  // Prevenir zoom do navegador globalmente
  React.useEffect(() => {
    const preventZoom = (e: Event) => {
      if (e instanceof WheelEvent) {
        // Se for um evento de zoom (Ctrl+Wheel ou trackpad), prevenir
        if (e.ctrlKey || e.metaKey || Math.abs(e.deltaY) < 10) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    // Adicionar listener no document para capturar todos os eventos de wheel
    document.addEventListener('wheel', preventZoom, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', preventZoom);
    };
  }, []);

  // Update highlighted cards when search changes
  React.useEffect(() => {
    getFilteredAndHighlightedCards();
  }, [getFilteredAndHighlightedCards]);

  // Todos os cards são renderizados diretamente
  const allCards = boardState.cards;
  
  // Debug: verificar se os cards existem
  console.log('Board renderizando:', { 
    totalCards: allCards.length, 
    cards: allCards,
    viewport: viewport 
  });

  // Limpar seleção ao pressionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection]);

  // Limpar seleção ao clicar fora do board
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Não limpar seleção quando clicar na ActionBar/toolbar
      const target = e.target as Node;
      if ((target as HTMLElement)?.closest?.('.figma-toolbar')) {
        return;
      }
      if (boardRef.current && !boardRef.current.contains(target)) {
        clearSelection();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSelection]);

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative"
      style={{
        background: 'linear-gradient(180deg, rgba(78, 205, 207, 0.60) 0%, rgba(20, 249, 253, 0.60) 100%)'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >


      {/* Barra de ferramentas flutuante */}
      {!isFocusMode && <Header />}

      {/* ActionBar - sempre visível para mostrar o botão do chat */}
      {(() => {
        const selectedCardsData = Array.from(selectedCards)
          .map(id => boardState.cards.find(card => card.id === id))
          .filter(Boolean) as CardData[];

        console.log('🎭 Renderizando ActionBar:', {
          selectedCards: selectedCardsData,
          selectedCardsArray: Array.from(selectedCards)
        });
        
        return (
          <ActionBar
            isVisible={true} // Sempre visível
            selectedCards={selectedCardsData}
            onClearSelection={clearSelection}
            onDelete={handleBulkDelete}
            onDuplicate={handleBulkDuplicate}
            onChangeColor={handleBulkColorChange}
            onViewFullscreen={handleViewFullscreen}
            onDownload={handleDownload}
            onRotate={handleRotate}
            onOpenLink={handleOpenLink}
            onCopyLink={handleCopyLink}
            onViewPDF={handleViewPDF}
            onEditContent={handleEditContent}
            onAddTag={handleAddTag}
            onOpenChat={() => setIsChatOpen(true)}
          />
        );
      })()}

      {/* Overlay de drag & drop */}
      {/* isDragOverCanvas && ( // Removed as per edit hint
        <div className="fixed inset-0 z-50 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-dashed border-blue-400 text-center">
            <div className="text-4xl mb-4">📁</div>
            <div className="text-xl font-semibold text-gray-800 mb-2">
              Solte para adicionar ao board
            </div>
            <div className="text-sm text-gray-600">
              Os arquivos aparecerão no centro da tela
            </div>
          </div>
        </div>
      ) */}
      
      {/* Grid de fundo infinito */}
      <div 
        className="absolute inset-0 board-grid"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: '0 0'
        }}
      />
      
      {/* Canvas infinito para os cards */}
      <div 
        id="main-content"
        ref={boardRef}
        className="absolute inset-0"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
          transformOrigin: '0 0'
        }}
        role="main"
        aria-label="Visual board with cards"
        onClick={(e) => {
          // Se clicou diretamente no canvas (não em um card), limpar seleção
          if (e.target === e.currentTarget) {
            clearSelection();
          }
        }}
      >
        {/* Grid Visual Overlay */}
        <GridOverlay
          isVisible={isSnapToGrid}
          gridSize={gridSize}
          viewport={viewport}
          boardSize={{ width: 5000, height: 3000 }} // Tamanho do canvas virtual
        />
        {/* Renderizar todos os cards */}
        {allCards.map((card) => renderCard(card))}
      </div>

      {/* Lightbox overlay for image/pdf */}
      {lightbox.open && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightbox({ open: false })}
        >
          <div className="max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {lightbox.type === 'image' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lightbox.src} alt="preview" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
            )}
            {lightbox.type === 'pdf' && (
              <object data={lightbox.src} type="application/pdf" className="max-w-full max-h-[90vh] w-[90vw] h-[90vh] rounded-lg shadow-2xl">
                <embed src={lightbox.src} type="application/pdf" className="max-w-full max-h-[90vh] w-[90vw] h-[90vh] rounded-lg shadow-2xl" />
              </object>
            )}
          </div>
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            onClick={() => setLightbox({ open: false })}
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
      )}

      {/* Controles de Zoom */}
      {!isFocusMode && (
        <ZoomControls
          scale={viewport.scale}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
          minZoom={0.05}
          maxZoom={3}
        />
      )}

      {/* Minimap */}
      {!isFocusMode && (
        <Minimap
          cards={boardState.cards}
          viewport={viewport}
          boardBounds={{ width: 1920, height: 1080 }} // TODO: pegar do ref
          onViewportChange={setViewport}
        />
      )}

      {/* Área de upload removida - agora o canvas inteiro aceita uploads */}



      {/* Indicadores de Upload */}
      <UploadProgress uploads={uploadState.uploads} />

      {/* Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedCards={Array.from(selectedCards).map(id => boardState.cards.find(card => card.id === id)).filter(Boolean) as CardData[]}
        onCreateSticker={(content, position) => {
          console.log('Criando sticky do chat:', { content, position });
          // TODO: Implementar criação de sticky
        }}
        onCreatePaper={(content, position) => {
          console.log('Criando paper do chat:', { content, position });
          // TODO: Implementar criação de paper
        }}
      />

      {/* Shortcuts Overlay */}
      <ShortcutsOverlay
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Desktop Tools Config */}
      <DesktopToolsConfig
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        isSnapToGrid={isSnapToGrid}
        onToggleSnapToGrid={() => setIsSnapToGrid(prev => !prev)}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode(prev => !prev)}
      />

      {/* Barra de Status Desktop */}
      <DesktopStatusBar
        isSnapToGrid={isSnapToGrid}
        gridSize={gridSize}
        isFocusMode={isFocusMode}
        selectedCardsCount={selectedCards.size}
        viewportScale={viewport.scale}
        totalCards={boardState.cards.length}
      />

      {/* Indicador de Modo Foco */}
      {isFocusMode && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Modo Foco Ativo</span>
          <button
            onClick={() => setIsFocusMode(false)}
            className="ml-2 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
