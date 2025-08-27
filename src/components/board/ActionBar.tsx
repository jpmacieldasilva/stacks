"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardData } from "@/types/board";

type ActionBarProps = {
  isVisible: boolean;
  selectedCards: CardData[];
  onClearSelection: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onChangeColor: (color: CardData['color']) => void;
  onViewFullscreen?: () => void;
  onDownload?: () => void;
  onRotate?: () => void;
  onOpenLink?: () => void;
  onCopyLink?: () => void;
  onViewPDF?: () => void;
  onEditContent?: () => void;
  onAddTag?: () => void;
  onOpenChat?: () => void; // Nova prop para abrir o chat
};

export function ActionBar({
  isVisible,
  selectedCards,
  onDelete,
  onDuplicate,
  onChangeColor,
  onViewFullscreen,
  onDownload,
  onRotate,
  onOpenLink,
  onCopyLink,
  onViewPDF,
  onEditContent,
  onAddTag,
  onOpenChat
}: ActionBarProps) {
  console.log('🚀 ActionBar FUNCTION CHAMADA');
  console.log('🎭 ActionBar renderizando:', { isVisible, selectedCardsCount: selectedCards.length, selectedCards });
  
  if (!isVisible) {
    console.log('❌ ActionBar não visível');
    return null;
  }

  console.log('✅ ActionBar visível');

  // Se múltiplos cards estão selecionados, mostrar apenas ações comuns
  const isMultipleSelection = selectedCards.length > 1;
  const selectedCard = selectedCards[0]; // Para ações específicas do tipo
  
  console.log('📊 Tipo de seleção:', { isMultipleSelection, selectedCardType: selectedCard?.type, selectedCard });

  // Botão Chat IA (sempre visível)
  const chatAction = (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onOpenChat?.();
      }}
      className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
      title="Chat com IA"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </button>
  );

  // Ações comuns para todos os tipos (apenas quando há seleção)
  const commonActions = selectedCards.length > 0 ? (
    <>
      {/* Botão Duplicar */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('🔄 Botão duplicar clicado');
          onDuplicate();
        }}
        className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
        title="Duplicar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
          <path d="M11 7V15M7 11H15M4 2H18C19.1046 2 20 2.89543 20 4V18C20 19.1046 19.1046 20 18 20H4C2.89543 20 2 19.1046 2 18V4C2 2.89543 2.89543 2 4 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </svg>
      </button>

      {/* Botão Excluir */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('🔄 Botão excluir clicado');
          onDelete();
        }}
        className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
        title="Excluir"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 22 24">
          <path d="M2 6H4M4 6H20M4 6V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H16C16.5304 22 17.0391 21.7893 17.4142 21.4142C17.7893 21.0391 18 20.5304 18 20V6M7 6V4C7 3.46957 7.21071 2.96086 7.58579 2.58579C7.96086 2.21071 8.46957 2 9 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V6M9 11V17M13 11V17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </svg>
      </button>
    </>
  ) : null;

  // Ações específicas para cada tipo de card
  const renderTypeSpecificActions = () => {
    console.log('🎨 renderTypeSpecificActions chamado');
    console.log('📊 Parâmetros:', { isMultipleSelection, selectedCardType: selectedCard?.type });
    
    if (isMultipleSelection) {
      console.log('❌ Seleção múltipla - não renderizando ações específicas');
      return null;
    }

    console.log('✅ Renderizando ações específicas para tipo:', selectedCard?.type);

    switch (selectedCard?.type) {
      case 'sticky':
        return (
          <>
            {/* Botão Mudar Cor */}
            <div className="flex items-center gap-1">
              {(['pink', 'yellow', 'green', 'purple', 'blue', 'orange'] as const).map((color) => (
                <button
                  key={color}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🎨 Mudando cor para:', color);
                    onChangeColor(color);
                  }}
                  className={`w-6 h-6 rounded-full border-2 border-white/20 transition-all hover:scale-110 ${
                    selectedCard.color === color ? 'ring-2 ring-white' : ''
                  }`}
                  style={{
                    backgroundColor: color === 'pink' ? '#ec4899' :
                                 color === 'yellow' ? '#eab308' :
                                 color === 'green' ? '#22c55e' :
                                 color === 'purple' ? '#a855f7' :
                                 color === 'blue' ? '#3b82f6' :
                                 color === 'orange' ? '#f97316' : '#6b7280'
                  }}
                  title={`Mudar para ${color}`}
                />
              ))}
            </div>

            {/* Botão Editar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditContent?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Editar sticky"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V11M14 2H20V8M14 2L20 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>
          </>
        );

      case 'paper':
        return (
          <>
            {/* Botão Visualizar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewFullscreen?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Visualizar paper"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M15 3H21V9M15 3L21 9M9 21H3V15M9 21L3 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>

            {/* Botão Editar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditContent?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Editar paper"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V11M14 2H20V8M14 2L20 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>
          </>
        );

      case 'image':
        return (
          <>
            {/* Botão Visualizar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewFullscreen?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Visualizar imagem"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M15 3H21V9M15 3L21 9M9 21H3V15M9 21L3 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>

            {/* Botão Baixar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Baixar imagem"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>

            {/* Botão Rotacionar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRotate?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Rotacionar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M13 11C12.5705 10.4259 12.0226 9.95085 11.3934 9.60705C10.7642 9.26325 10.0685 9.05888 9.35333 9.00768C8.63821 8.95647 7.92043 9.05966 7.24867 9.31023C6.57691 9.5608 5.96691 9.95299 5.46 10.46L2.46 13.46C1.54922 14.403 1.04522 15.666 1.05652 16.977C1.06782 18.288 1.59374 19.542 2.52094 20.4692C3.44814 21.3964 4.70221 21.9224 6.01319 21.9337C7.32418 21.945 8.58718 21.441 9.53 20.53L11.25 18.82C11.8511 18.2179 12.1136 17.3402 11.9669 16.4913C11.8202 15.6423 11.2782 14.9146 10.5 14.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>

            {/* Botão Copiar Link */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopyLink?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Copiar link"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M8 4V2C8 1.46957 8.21071 0.960859 8.58579 0.585786C8.96086 0.210714 9.46957 0 10 0H20C20.5304 0 21.0391 0.210714 21.4142 0.585786C21.7893 0.960859 22 1.46957 22 2V12C22 12.5304 21.7893 13.0391 21.4142 13.4142C21.0391 13.7893 20.5304 14 20 14H18M8 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V14M8 4H10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>

            {/* Botão Editar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditContent?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Editar link"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V11M14 2H20V8M14 2L20 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>
          </>
        );

      case 'pdf':
        return (
          <>
            {/* Botão Visualizar PDF */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewPDF?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Visualizar PDF"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                <path d="M14 2V8H20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                <path d="M9 15H13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                <path d="M9 11H13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                <path d="M9 19H13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>

            {/* Botão Baixar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Baixar PDF"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>

            {/* Botão Editar */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditContent?.();
              }}
              className="w-10 h-10 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
              title="Editar metadados"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 22 22">
                <path d="M11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V16C4 16.5304 4.21071 17.0391 4.58579 17.4142C4.96086 17.7893 5.46957 18 6 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V11M14 2H20V8M14 2L20 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 inset-x-0 z-40 flex justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="figma-toolbar flex items-center gap-3 bg-black/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
          {/* Botão Chat IA (sempre visível) */}
          {chatAction}
          
          {/* Separador visual quando há outras ações */}
          {(selectedCards.length > 0 || renderTypeSpecificActions()) && (
            <div className="w-px h-8 bg-white/20 mx-2" />
          )}
          
          {/* Ações específicas do tipo */}
          {renderTypeSpecificActions()}
          
          {/* Separador visual */}
          {!isMultipleSelection && renderTypeSpecificActions() && commonActions && (
            <div className="w-px h-8 bg-white/20 mx-2" />
          )}
          
          {/* Ações comuns */}
          {commonActions}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
