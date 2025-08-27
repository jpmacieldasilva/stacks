"use client";
import { useState, useCallback } from "react";
import { CardData, Position, BoardState, TagData } from "@/types/board";

const INITIAL_CARDS: CardData[] = [
  {
    id: "1",
    type: "sticky",
    content: "Ideia para o projeto...",
    position: { x: 100, y: 100 },
    color: "yellow",
    size: "md"
  },
  {
    id: "2", 
    type: "sticky",
    content: "Outra ideia interessante",
    position: { x: 300, y: 150 },
    color: "pink",
    size: "sm"
  },
  {
    id: "3",
    type: "sticky", 
    content: "Lembrar de implementar isso",
    position: { x: 200, y: 300 },
    color: "green",
    size: "lg"
  },
  {
    id: "4",
    type: "sticky",
    content: "Nota importante",
    position: { x: 500, y: 200 },
    color: "purple",
    size: "md"
  },
  {
    id: "5",
    type: "sticky",
    content: "Tarefa para hoje",
    position: { x: 400, y: 400 },
    color: "blue",
    size: "sm"
  },
  // Card de imagem de exemplo para testar redimensionamento
  {
    id: "6",
    type: "image",
    content: "https://picsum.photos/400/300?random=1",
    position: { x: 600, y: 100 },
    width: 250,
    height: 180,
    metadata: {
      fileName: "imagem-exemplo.jpg",
      fileSize: "245760"
    }
  }
];

export function useBoard() {
  const [boardState, setBoardState] = useState<BoardState>({
    cards: INITIAL_CARDS,
    tags: [],
    viewport: {
      scale: 1,
      x: 0,
      y: 0
    }
  });

  const [searchState, setSearchState] = useState({
    query: "",
    typeFilters: [] as CardData['type'][],
    tagFilters: [] as string[],
    highlightedCards: [] as string[]
  });

  const [uploadState, setUploadState] = useState({
    uploads: [] as Array<{
      id: string;
      fileName: string;
      progress: number;
      status: 'uploading' | 'completed' | 'error';
      error?: string;
    }>
  });

  const addCard = useCallback((cardData: Omit<CardData, 'id'>) => {
    const newCard: CardData = {
      ...cardData,
      id: Date.now().toString(),
      color: cardData.color || 'yellow',
      size: cardData.size || 'md'
    };
    
    setBoardState(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  }, []);

  const addFileCard = useCallback(async (file: File, position: Position) => {
    const uploadId = Date.now().toString();
    const fileName = file.name;
    const fileSize = file.size;

    // Adicionar upload ao estado
    setUploadState(prev => ({
      uploads: [...prev.uploads, {
        id: uploadId,
        fileName,
        progress: 0,
        status: 'uploading'
      }]
    }));

    try {
      // Simular upload com progresso baseado no tamanho do arquivo
      const duration = Math.min(Math.max(fileSize / 1000000, 0.5), 3); // 0.5s a 3s baseado no tamanho
      const steps = 20;
      const stepDuration = (duration * 1000) / steps;

      for (let i = 0; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        const progress = (i / steps) * 100;
        
        setUploadState(prev => ({
          uploads: prev.uploads.map(upload =>
            upload.id === uploadId ? { ...upload, progress } : upload
          )
        }));
      }

      // Processar arquivo após upload completo
      const fileUrl = URL.createObjectURL(file);
      let cardData: Omit<CardData, 'id'>;

      if (file.type.startsWith('image/')) {
        cardData = {
          type: 'image',
          content: fileUrl,
          position,
          metadata: {
            fileName,
            fileSize: fileSize.toString(),
            fileType: file.type
          }
        };
      } else if (file.type === 'application/pdf') {
        cardData = {
          type: 'pdf',
          content: fileUrl,
          position,
          metadata: {
            fileName,
            fileSize: fileSize.toString(),
            fileType: file.type
          }
        };
      } else {
        // For other file types, create a generic file card
        cardData = {
          type: 'sticky',
          content: `Arquivo: ${fileName}`,
          position,
          metadata: {
            fileName,
            fileSize: fileSize.toString(),
            fileType: file.type
          }
        };
      }

      // Marcar upload como completo
      setUploadState(prev => ({
        uploads: prev.uploads.map(upload =>
          upload.id === uploadId ? { ...upload, status: 'completed' } : upload
        )
      }));

      // Adicionar card
      addCard(cardData);

      // Remover upload da lista após 2 segundos
      setTimeout(() => {
        setUploadState(prev => ({
          uploads: prev.uploads.filter(upload => upload.id !== uploadId)
        }));
      }, 2000);

    } catch (error) {
      // Marcar upload como erro
      setUploadState(prev => ({
        uploads: prev.uploads.map(upload =>
          upload.id === uploadId ? { 
            ...upload, 
            status: 'error',
            error: error instanceof Error ? error.message : 'Erro no upload'
          } : upload
        )
      }));

      // Remover upload com erro após 5 segundos
      setTimeout(() => {
        setUploadState(prev => ({
          uploads: prev.uploads.filter(upload => upload.id !== uploadId)
        }));
      }, 5000);
    }
  }, [addCard]);

  const addLinkCard = useCallback((url: string, position: Position) => {
    // Basic link card - in a real app, you'd fetch metadata
    const cardData: Omit<CardData, 'id'> = {
      type: 'link',
      content: url,
      position,
      metadata: {
        title: 'Link',
        description: 'Clique para abrir',
        url
      }
    };

    addCard(cardData);
  }, [addCard]);



  const updateCardPosition = useCallback((cardId: string, newPosition: Position) => {
    // Otimização: usar requestAnimationFrame para melhor performance durante dragging
    requestAnimationFrame(() => {
      setBoardState(prev => {
        const updatedCards = prev.cards.map(card =>
          card.id === cardId
            ? { ...card, position: newPosition }
            : card
        );

        return { ...prev, cards: updatedCards };
      });
    });
  }, []);

  const updateCardSize = useCallback((cardId: string, width: number, height: number) => {
    console.log('🔄 updateCardSize chamada:', { cardId, width, height });
    setBoardState(prev => {
      const updatedCards = prev.cards.map(card =>
        card.id === cardId
          ? { ...card, width, height }
          : card
      );

      console.log('📝 Estado atualizado:', updatedCards.find(c => c.id === cardId));
      return { ...prev, cards: updatedCards };
    });
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setBoardState(prev => ({
      ...prev,
      cards: prev.cards.filter(card => card.id !== cardId)
    }));
  }, []);

  const updateCardContent = useCallback((cardId: string, content: string) => {
    setBoardState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId
          ? { ...card, content }
          : card
      )
    }));
  }, []);

  const updateCardTitle = useCallback((cardId: string, title: string) => {
    setBoardState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId
          ? { ...card, metadata: { ...card.metadata, title } }
          : card
      )
    }));
  }, []);

  const updateCardMetadata = useCallback((cardId: string, metadata: Record<string, string | number | boolean>) => {
    setBoardState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId
          ? { ...card, metadata: { ...card.metadata, ...metadata } }
          : card
      )
    }));
  }, []);



  const startDragging = useCallback((cardId: string, mousePosition: Position) => {
    const card = boardState.cards.find(c => c.id === cardId);
    if (card) {
      const offset: Position = {
        x: mousePosition.x - card.position.x,
        y: mousePosition.y - card.position.y
      };
      return offset;
    }
    return { x: 0, y: 0 };
  }, [boardState.cards]);

  const updateDraggedPosition = useCallback((cardId: string, mousePosition: Position, offset: Position) => {
    const newPosition: Position = {
      x: mousePosition.x - offset.x,
      y: mousePosition.y - offset.y
    };
    updateCardPosition(cardId, newPosition);
  }, [updateCardPosition]);

  const searchCards = useCallback((query: string) => {
    if (!query.trim()) return boardState.cards;
    const lowerQuery = query.toLowerCase();
    return boardState.cards.filter(card => {
      // Search in content
      if (card.content.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in title (for papers)
      if (typeof card.metadata?.title === 'string' && 
          card.metadata.title.toLowerCase().includes(lowerQuery)) return true;
      
      // Search in filename (for files)
      if (typeof card.metadata?.fileName === 'string' && 
          card.metadata.fileName.toLowerCase().includes(lowerQuery)) return true;
      
      return false;
    });
  }, [boardState.cards]);

  // Tag management functions
  const addTag = useCallback((tag: Omit<TagData, 'id'>) => {
    const newTag: TagData = {
      ...tag,
      id: Date.now().toString()
    };
    
    setBoardState(prev => ({
      ...prev,
      tags: [...prev.tags, newTag]
    }));
    
    return newTag;
  }, []);

  const removeTag = useCallback((tagId: string) => {
    setBoardState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.id !== tagId),
      cards: prev.cards.map(card => ({
        ...card,
        tags: card.tags?.filter(id => id !== tagId)
      }))
    }));
  }, []);

  const addTagToCard = useCallback((cardId: string, tagId: string) => {
    setBoardState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId
          ? { ...card, tags: [...(card.tags || []), tagId] }
          : card
      )
    }));
  }, []);

  const removeTagFromCard = useCallback((cardId: string, tagId: string) => {
    setBoardState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId
          ? { ...card, tags: card.tags?.filter(id => id !== tagId) }
          : card
      )
    }));
  }, []);

  const filterCardsByTags = useCallback((tagIds: string[]) => {
    if (tagIds.length === 0) return boardState.cards;
    return boardState.cards.filter(card =>
      card.tags?.some(tagId => tagIds.includes(tagId))
    );
  }, [boardState.cards]);

  const filterCardsByType = useCallback((types: CardData['type'][]) => {
    if (types.length === 0) return boardState.cards;
    return boardState.cards.filter(card => types.includes(card.type));
  }, [boardState.cards]);

  const updateSearchState = useCallback((updates: Partial<typeof searchState>) => {
    setSearchState(prev => ({ ...prev, ...updates }));
  }, []);

  const getFilteredAndHighlightedCards = useCallback(() => {
    let filteredCards = boardState.cards;

    // Apply search query
    if (searchState.query.trim()) {
      filteredCards = searchCards(searchState.query);
    }

    // Apply type filters
    if (searchState.typeFilters.length > 0) {
      filteredCards = filteredCards.filter(card => 
        searchState.typeFilters.includes(card.type)
      );
    }

    // Apply tag filters
    if (searchState.tagFilters.length > 0) {
      filteredCards = filteredCards.filter(card =>
        card.tags?.some(tagId => searchState.tagFilters.includes(tagId))
      );
    }

    // Update highlighted cards
    const highlightedIds = filteredCards.map(card => card.id);
    if (highlightedIds.join(',') !== searchState.highlightedCards.join(',')) {
      setSearchState(prev => ({ ...prev, highlightedCards: highlightedIds }));
    }

    return filteredCards;
  }, [boardState.cards, searchState, searchCards]);

  // Funções para a barra de ferramentas flutuante
  const duplicateCard = useCallback((card: CardData) => {
    const newCard = {
      ...card,
      id: Date.now().toString(),
      position: {
        x: card.position.x + 20,
        y: card.position.y + 20
      }
    };
    setBoardState(prev => ({
      ...prev,
      cards: [...prev.cards, newCard]
    }));
  }, []);

  const updateCardColor = useCallback((cardId: string, color: CardData['color']) => {
    setBoardState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId ? { ...card, color } : card
      )
    }));
  }, []);

  return {
    boardState,
    searchState,
    uploadState,
    addCard,
    addFileCard,
    addLinkCard,
    updateCardPosition,
    updateCardSize,
    removeCard,
    updateCardContent,
    updateCardTitle,
    updateCardMetadata,
    startDragging,
    updateDraggedPosition,
    searchCards,

    addTag,
    removeTag,
    addTagToCard,
    removeTagFromCard,
    filterCardsByTags,
    filterCardsByType,
    updateSearchState,
    getFilteredAndHighlightedCards,
    duplicateCard,
    updateCardColor
  };
}