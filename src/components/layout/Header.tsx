"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBoardContext } from "@/contexts/BoardContext";
import { CardData } from "@/types/board";

export function Header() {
  const { addCard, addLinkCard, updateSearchState, searchState } = useBoardContext();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddSticky = (color: CardData['color'] = 'yellow', size: CardData['size'] = 'md') => {
    const randomX = Math.random() * 800 + 100;
    const randomY = Math.random() * 600 + 100;
    
    addCard({
      type: 'sticky',
      content: 'Nova ideia...',
      position: { x: randomX, y: randomY },
      color,
      size
    });
    setIsExpanded(false);
  };

  const handleAddPaper = () => {
    const randomX = Math.random() * 600 + 200;
    const randomY = Math.random() * 400 + 200;
    
    addCard({
      type: 'paper',
      content: 'Escreva suas notas aqui...',
      position: { x: randomX, y: randomY },
      metadata: {
        title: 'Novo Paper'
      }
    });
    setIsExpanded(false);
  };

  const handleAddLink = () => {
    if (linkUrl.trim()) {
      const randomX = Math.random() * 600 + 200;
      const randomY = Math.random() * 400 + 200;
      
      addLinkCard(linkUrl.trim(), { x: randomX, y: randomY });
      setLinkUrl("");
      setShowLinkInput(false);
      setIsExpanded(false);
    }
  };

  const handleLinkKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddLink();
    } else if (e.key === 'Escape') {
      setShowLinkInput(false);
      setLinkUrl("");
      setIsExpanded(false);
    }
  };

  const handleSearch = (query: string) => {
    updateSearchState({ query });
  };

  const handleTypeFilterToggle = (type: CardData['type']) => {
    const newTypeFilters = searchState.typeFilters.includes(type)
      ? searchState.typeFilters.filter(t => t !== type)
      : [...searchState.typeFilters, type];
    updateSearchState({ typeFilters: newTypeFilters });
  };

  const clearTypeFilters = () => {
    updateSearchState({ query: "", tagFilters: [], typeFilters: [] });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed top-6 left-6 right-6 z-50 flex items-center justify-between">
      {/* Barra da esquerda - Busca + Filtro */}
      <div className="figma-header flex items-center gap-4 relative">
        {/* Input de busca */}
        <Input
          placeholder="Buscar..."
          className="w-48 h-8 bg-transparent border-none text-[#d9d9d9] placeholder:text-[#d9d9d9]/60 focus:outline-none focus:ring-0"
          value={searchState.query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
        />
        
        {/* Ícone de filtro */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 text-[#d9d9d9] hover:bg-white/10 rounded-lg"
          onClick={() => setShowTypeFilter(!showTypeFilter)}
          title="Filtrar por tipo"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 22">
            <path d="M22 2H2L10 11.46V18L14 20V11.46L22 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </Button>

        {/* Filtro por tipo - agora posicionado na mesma linha */}
        {showTypeFilter && (
          <div className="absolute top-full left-0 mt-2 bg-black/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-3 min-w-64 z-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm text-white">Filtrar por tipo</h3>
              {searchState.typeFilters.length > 0 && (
                <button
                  onClick={clearTypeFilters}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Limpar ({searchState.typeFilters.length})
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {[
                { type: 'sticky' as CardData['type'], label: '📝 Stickies', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
                { type: 'paper' as CardData['type'], label: '📄 Papers', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
                { type: 'image' as CardData['type'], label: '🖼️ Imagens', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
                { type: 'pdf' as CardData['type'], label: '📄 PDFs', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
                { type: 'link' as CardData['type'], label: '🔗 Links', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }
              ].map(({ type, label, color }) => (
                <button
                  key={type}
                  onClick={() => handleTypeFilterToggle(type)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    searchState.typeFilters.includes(type) 
                      ? color 
                      : 'hover:bg-white/10 text-white border-white/20'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/20">
              <button
                onClick={() => setShowTypeFilter(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botão de adicionar animado - Direita */}
      <div className="relative">
        <div 
          className={`flex items-center gap-2 transition-all duration-300 ease-in-out ${
            isExpanded ? 'w-48' : 'w-10'
          }`}
        >
          {/* Botão principal quadrado */}
          <Button
            onClick={toggleExpanded}
            className="h-10 w-10 p-0 bg-[#2c2c2c] hover:bg-[#3c3c3c] text-[#d9d9d9] rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out"
            size="sm"
            title={isExpanded ? "Fechar" : "Adicionar"}
          >
            {isExpanded ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 18 18">
                <path d="M9 2V16M2 9H16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            )}
          </Button>

          {/* Opções expandidas */}
          <div className={`flex items-center gap-2 transition-all duration-300 ease-in-out ${
            isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
          }`}>
            {/* Botão Link */}
            <Button
              onClick={() => setShowLinkInput(true)}
              className="h-10 w-10 p-0 bg-[#2c2c2c] hover:bg-[#3c3c3c] text-[#d9d9d9] rounded-xl flex items-center justify-center"
              size="sm"
              title="Adicionar Link"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </Button>

            {/* Botão Sticky */}
            <Button
              onClick={() => handleAddSticky('yellow')}
              className="h-10 w-10 p-0 bg-[#2c2c2c] hover:bg-[#3c3c3c] text-[#d9d9d9] rounded-xl flex items-center justify-center"
              size="sm"
              title="Novo Sticky"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </Button>

            {/* Botão Paper */}
            <Button
              onClick={handleAddPaper}
              className="h-10 w-10 p-0 bg-[#2c2c2c] hover:bg-[#3c3c3c] text-[#d9d9d9] rounded-xl flex items-center justify-center"
              size="sm"
              title="Novo Paper"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Input de link */}
      {showLinkInput && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-80 z-50">
          <div className="flex gap-2">
            <Input
              placeholder="Cole a URL aqui..."
              value={linkUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLinkUrl(e.target.value)}
              onKeyDown={handleLinkKeyPress}
              className="flex-1"
              autoFocus
            />
            <Button
              onClick={handleAddLink}
              disabled={!linkUrl.trim()}
              size="sm"
              className="px-4"
            >
              Adicionar
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Pressione Enter para adicionar ou Esc para cancelar
          </div>
        </div>
      )}
    </div>
  );
}
