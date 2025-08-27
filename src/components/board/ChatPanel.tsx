"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardData } from "@/types/board";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  context?: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCards: CardData[];
  onCreateSticker: (content: string, position: { x: number; y: number }) => void;
  onCreatePaper: (content: string, position: { x: number; y: number }) => void;
}

export function ChatPanel({
  isOpen,
  onClose,
  selectedCards,
  onCreateSticker,
  onCreatePaper
}: ChatPanelProps) {
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Criar novo chat quando abrir
  useEffect(() => {
    if (isOpen && !currentChat) {
      const newChat: ChatSession = {
        id: Date.now().toString(),
        title: `Chat ${new Date().toLocaleTimeString()}`,
        messages: [],
        createdAt: new Date(),
        context: generateContextFromCards(selectedCards)
      };
      setCurrentChat(newChat);
    }
  }, [isOpen, currentChat, selectedCards]);

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Gerar contexto baseado nos cards selecionados
  const generateContextFromCards = (cards: CardData[]): string => {
    if (cards.length === 0) {
      return "Nenhum card selecionado. Você pode conversar sobre o board em geral.";
    }

    const contextParts = cards.map(card => {
      switch (card.type) {
        case 'sticky':
          return `Sticky "${card.content}" (${card.color || 'sem cor'})`;
        case 'paper':
          return `Paper "${card.content}"`;
        case 'image':
          return `Imagem "${card.metadata?.filename || 'sem nome'}"`;
        case 'link':
          return `Link "${card.content}"`;
        case 'pdf':
          return `PDF "${card.metadata?.filename || 'sem nome'}"`;
        default:
          return `Card "${card.content}"`;
      }
    });

    return `Cards selecionados: ${contextParts.join(', ')}`;
  };

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentChat) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Adicionar mensagem do usuário
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage]
    };
    setCurrentChat(updatedChat);
    setInputMessage("");
    setIsLoading(true);

    // Simular resposta da IA (aqui você integraria com sua API de IA)
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Entendi sua mensagem sobre: "${inputMessage}". Como posso ajudar com ${selectedCards.length > 0 ? 'os cards selecionados' : 'o board'}?`,
        timestamp: new Date()
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMessage]
      };
      setCurrentChat(finalChat);
      setIsLoading(false);
    }, 1000);
  };

  // Salvar chat atual no histórico
  const saveCurrentChat = () => {
    if (currentChat && currentChat.messages.length > 0) {
      setChatHistory(prev => [currentChat, ...prev]);
      setCurrentChat(null);
      onClose();
    }
  };

  // Abrir chat do histórico
  const openChatFromHistory = (chat: ChatSession) => {
    setCurrentChat(chat);
    setShowHistory(false);
  };

  // Criar sticker a partir do texto selecionado
  const handleCreateSticker = () => {
    if (selectedText.trim()) {
      const position = { x: Math.random() * 400, y: Math.random() * 300 };
      onCreateSticker(selectedText, position);
      setSelectedText("");
    }
  };

  // Criar paper a partir do texto selecionado ou chat completo
  const handleCreatePaper = (useFullChat: boolean = false) => {
    const content = useFullChat 
      ? currentChat?.messages.map(m => `${m.role}: ${m.content}`).join('\n\n') || ""
      : selectedText;
    
    if (content.trim()) {
      const position = { x: Math.random() * 400, y: Math.random() * 300 };
      onCreatePaper(content, position);
      if (!useFullChat) setSelectedText("");
    }
  };

  // Selecionar texto do chat
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-1/4 bg-black/90 backdrop-blur-sm border-l border-white/20 shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20 bg-black/50">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-8 h-8 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
                title="Histórico de chats"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <h3 className="font-semibold text-[#d9d9d9] text-sm">Chat IA</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={saveCurrentChat}
                className="w-8 h-8 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
                title="Salvar chat"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-[#d9d9d9] hover:bg-white/10 rounded-lg transition-colors"
                title="Fechar chat"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Histórico de chats */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-white/20 bg-black/30"
              >
                <div className="p-4 max-h-48 overflow-y-auto">
                  <h4 className="font-medium text-[#d9d9d9] text-sm mb-3">Chats Anteriores</h4>
                  {chatHistory.length === 0 ? (
                    <p className="text-white/60 text-xs">Nenhum chat salvo</p>
                  ) : (
                    <div className="space-y-2">
                      {chatHistory.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => openChatFromHistory(chat)}
                          className="w-full text-left p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <div className="font-medium text-sm text-[#d9d9d9]">{chat.title}</div>
                          <div className="text-xs text-white/60">
                            {chat.messages.length} mensagens • {chat.createdAt.toLocaleDateString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conteúdo dos cards selecionados */}
          {selectedCards.length > 0 && (
            <div className="p-4 bg-blue-500/20 border-b border-blue-400/30">
              <h4 className="font-medium text-blue-300 text-sm mb-2">Conteúdo Selecionado</h4>
              <div className="space-y-2">
                {selectedCards.map((card) => (
                  <div key={card.id} className="text-xs text-blue-200 bg-blue-500/20 p-2 rounded">
                    <div className="font-medium mb-1">{card.type.toUpperCase()}:</div>
                    <div className="text-blue-100">{card.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500/80 text-white'
                      : 'bg-white/10 text-[#d9d9d9]'
                  }`}
                  onMouseUp={handleTextSelection}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Área de ações para texto selecionado */}
          {selectedText && (
            <div className="p-4 bg-yellow-500/20 border-t border-yellow-400/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-300">Texto selecionado:</span>
                <button
                  onClick={() => setSelectedText("")}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-yellow-200 mb-3 truncate">{selectedText}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateSticker}
                  className="px-3 py-1 bg-yellow-500/80 text-white text-xs rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  Criar Sticky
                </button>
                <button
                  onClick={() => handleCreatePaper(false)}
                  className="px-3 py-1 bg-blue-500/80 text-white text-xs rounded-lg hover:bg-blue-500 transition-colors"
                >
                  Criar Paper
                </button>
              </div>
            </div>
          )}

          {/* Input de mensagem */}
          <div className="p-4 border-t border-white/20 bg-black/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-[#d9d9d9] placeholder-white/40 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* Botão para salvar chat completo como paper */}
            {currentChat && currentChat.messages.length > 0 && (
              <button
                onClick={() => handleCreatePaper(true)}
                className="w-full mt-2 px-3 py-2 bg-green-500/80 text-white text-sm rounded-lg hover:bg-green-500 transition-colors"
              >
                Salvar Chat Completo como Paper
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
