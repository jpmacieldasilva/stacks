"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CardData } from "@/types/board";
import { 
  ArrowLeft,
  Bold,
  Italic,
  List,
  CheckSquare,
  MoreVertical,
  Trash2
} from "lucide-react";

// Tipos para o sistema de blocos
type BlockType = 'text' | 'title' | 'checklist' | 'tag';

interface Block {
  id: string;
  type: BlockType;
  content: string;
  completed?: boolean; // Para blocos de checklist
  order: number;
}

export default function PaperFullscreenPage() {
  const params = useParams();
  const router = useRouter();
  const paperId = params.id as string;
  
  const [paper, setPaper] = useState<CardData | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeFormatType, setActiveFormatType] = useState<BlockType>('text');
  
  // Estados para drag & drop
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  
  const blocksRef = useRef<HTMLDivElement>(null);

  // Simular busca do paper e converter para blocos
  useEffect(() => {
    const mockPaper: CardData = {
      id: paperId,
      type: "paper",
      content: "Essas features são polidas, centradas no usuário e aprimoram diretamente a produtividade e a sensação de controle em ferramentas de design, diagramação ou organização visual. Se sua aplicação é um editor visual (como está sugerido pelo contexto), essas propostas vão alinhar seu produto ao estado da arte do UX/UI para esse segmento.\n\nPequenos detalhes de interação (microinterações) como animação suave das linhas de snap, resposta rápida aos toques/movimentos e atalhos claros são destaque nas menções, trazendo a sensação de produto premium.",
      position: { x: 0, y: 0 },
      metadata: {
        title: "Tutorial visual rápido mostrando as possibilidades"
      }
    };
    
    setPaper(mockPaper);
    
    // Converter conteúdo para blocos
    const initialBlocks: Block[] = [
      {
        id: '1',
        type: 'title',
        content: String(mockPaper.metadata?.title || "Novo Paper"),
        order: 0
      },
      {
        id: '2',
        type: 'text',
        content: "Essas features são polidas, centradas no usuário e aprimoram diretamente a produtividade e a sensação de controle em ferramentas de design, diagramação ou organização visual.",
        order: 1
      },
      {
        id: '3',
        type: 'text',
        content: "Se sua aplicação é um editor visual (como está sugerido pelo contexto), essas propostas vão alinhar seu produto ao estado da arte do UX/UI para esse segmento.",
        order: 2
      },
      {
        id: '4',
        type: 'text',
        content: "Pequenos detalhes de interação (microinterações) como animação suave das linhas de snap, resposta rápida aos toques/movimentos e atalhos claros são destaque nas menções, trazendo a sensação de produto premium.",
        order: 3
      },
      {
        id: '5',
        type: 'checklist',
        content: 'Implementar sistema de blocos',
        completed: false,
        order: 4
      },
      {
        id: '6',
        type: 'checklist',
        content: 'Criar barra de formatação estilo Notion',
        completed: false,
        order: 5
      },
      {
        id: '7',
        type: 'checklist',
        content: 'Implementar drag & drop entre blocos',
        completed: false,
        order: 6
      }
    ];
    
    setBlocks(initialBlocks);
  }, [paperId]);

  // Auto-save quando blocos mudam
  useEffect(() => {
    if (blocks.length > 0) {
      const saveTimeout = setTimeout(() => {
        console.log('Auto-save:', blocks);
        // Aqui implementar lógica de salvamento real
      }, 1000);
      
      return () => clearTimeout(saveTimeout);
    }
  }, [blocks]);

  const handleBlockChange = useCallback((blockId: string, newContent: string) => {
    setBlocks(prev => 
      prev.map(block =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
    );
  }, []);

  const handleChecklistToggle = useCallback((blockId: string) => {
    setBlocks(prev => 
      prev.map(block =>
        block.id === blockId ? { ...block, completed: !block.completed } : block
      )
    );
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
  }, []);

  const addNewBlock = useCallback((type: BlockType, afterBlockId?: string) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: '',
      completed: false,
      order: afterBlockId ? 
        (blocks.find(b => b.id === afterBlockId)?.order || 0) + 1 : 
        blocks.length
    };

    if (afterBlockId) {
      // Reordenar blocos após o novo
      const updatedBlocks = blocks.map(block => 
        block.order > (blocks.find(b => b.id === afterBlockId)?.order || 0) 
          ? { ...block, order: block.order + 1 }
          : block
      );
      setBlocks([...updatedBlocks, newBlock]);
    } else {
      setBlocks(prev => [...prev, newBlock]);
    }

    setSelectedBlockId(newBlock.id);
    setActiveFormatType(type);
  }, [blocks]);

  const insertBlockAfter = useCallback((type: BlockType, afterBlockId: string) => {
    addNewBlock(type, afterBlockId);
  }, [addNewBlock]);

  const handleFormatTypeClick = useCallback((type: BlockType) => {
    setActiveFormatType(type);
    
    // Se há um bloco selecionado, inserir o novo bloco após ele
    if (selectedBlockId) {
      insertBlockAfter(type, selectedBlockId);
    } else {
      // Se não há bloco selecionado, adicionar ao final
      addNewBlock(type);
    }
  }, [selectedBlockId, insertBlockAfter, addNewBlock]);

  // Função para criar novo bloco automaticamente ao digitar no final
  const handleBlockInput = useCallback((blockId: string, newContent: string) => {
    setBlocks(prev => 
      prev.map(block =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
    );

    // Se o usuário está digitando no final do bloco e pressiona Enter, criar novo bloco
    const currentBlock = blocks.find(b => b.id === blockId);
    if (currentBlock && newContent.endsWith('\n')) {
      // Remover a quebra de linha do bloco atual
      handleBlockChange(blockId, newContent.slice(0, -1));
      
      // Criar novo bloco do mesmo tipo
      setTimeout(() => {
        insertBlockAfter(currentBlock.type, blockId);
      }, 0);
    }
  }, [blocks, handleBlockChange, insertBlockAfter]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, blockId: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // Encontrar o bloco atual
      const currentBlock = blocks.find(b => b.id === blockId);
      if (!currentBlock) return;
      
      // Inserir novo bloco do mesmo tipo após o atual
      insertBlockAfter(currentBlock.type, blockId);
    }
    
    if (e.key === 'Backspace' && (e.target as HTMLTextAreaElement).value === '') {
      e.preventDefault();
      
      // Se o bloco está vazio e não é o único, deletar
      if (blocks.length > 1) {
        deleteBlock(blockId);
        
        // Selecionar o bloco anterior ou próximo
        const currentIndex = blocks.findIndex(b => b.id === blockId);
        if (currentIndex > 0) {
          setSelectedBlockId(blocks[currentIndex - 1].id);
        } else if (currentIndex < blocks.length - 1) {
          setSelectedBlockId(blocks[currentIndex + 1].id);
        }
      }
    }
  }, [blocks, insertBlockAfter, deleteBlock]);

  // Funções para drag & drop
  const handleDragStart = useCallback((e: React.DragEvent, blockId: string) => {
    try {
      setDraggedBlockId(blockId);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', blockId);
    } catch (error) {
      console.error('Erro no drag start:', error);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, blockId: string) => {
    try {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverBlockId(blockId);
    } catch (error) {
      console.error('Erro no drag over:', error);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    try {
      setDragOverBlockId(null);
    } catch (error) {
      console.error('Erro no drag leave:', error);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetBlockId: string) => {
    try {
      e.preventDefault();
      
      if (draggedBlockId && draggedBlockId !== targetBlockId) {
        setBlocks(prev => {
          const draggedBlock = prev.find(b => b.id === draggedBlockId);
          const targetBlock = prev.find(b => b.id === targetBlockId);
          
          if (!draggedBlock || !targetBlock) return prev;
          
          // Remover o bloco arrastado
          const blocksWithoutDragged = prev.filter(b => b.id !== draggedBlockId);
          
          // Encontrar a posição do bloco alvo
          const targetIndex = blocksWithoutDragged.findIndex(b => b.id === targetBlockId);
          
          // Inserir o bloco arrastado na posição do alvo
          const newBlocks = [...blocksWithoutDragged];
          newBlocks.splice(targetIndex, 0, draggedBlock);
          
          // Atualizar a ordem de todos os blocos
          return newBlocks.map((block, index) => ({
            ...block,
            order: index
          }));
        });
      }
      
      setDraggedBlockId(null);
      setDragOverBlockId(null);
    } catch (error) {
      console.error('Erro no drop:', error);
      setDraggedBlockId(null);
      setDragOverBlockId(null);
    }
  }, [draggedBlockId]);

  // Função para ajustar altura do textarea
  const adjustTextareaHeight = useCallback((element: HTMLTextAreaElement) => {
    try {
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    } catch (error) {
      console.error('Erro ao ajustar altura:', error);
    }
  }, []);

  const handleBackToCanvas = () => {
    router.push(`/?paper=${paperId}&center=true`);
  };

  if (!paper) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando paper...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Bar - Estilo Notion */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToCanvas}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Salvo automaticamente</span>
        </div>
      </div>

      {/* Toolbar - Estilo Notion */}
      <div className="flex items-center gap-1 px-6 py-2 border-b border-gray-100 bg-white">
        <div className="flex items-center bg-gray-50 rounded-lg p-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-7 px-2 text-xs rounded ${activeFormatType === 'text' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            onClick={() => handleFormatTypeClick('text')}
          >
            Texto
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-7 px-2 text-xs rounded ${activeFormatType === 'title' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            onClick={() => handleFormatTypeClick('title')}
          >
            Título
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-7 px-2 text-xs rounded ${activeFormatType === 'checklist' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            onClick={() => handleFormatTypeClick('checklist')}
          >
            <CheckSquare className="w-3 h-3 mr-1" />
            Lista
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-7 px-2 text-xs rounded ${activeFormatType === 'tag' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
            onClick={() => handleFormatTypeClick('tag')}
          >
            #
          </Button>
        </div>
        
        <div className="w-px h-6 bg-gray-200 mx-2"></div>
        
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Bold className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Italic className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <List className="w-3 h-3" />
        </Button>
      </div>

      {/* Main Content com scroll */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-3xl mx-auto">
            {/* Blocos */}
            <div ref={blocksRef} className="space-y-1">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onDragOver={(e) => handleDragOver(e, block.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, block.id)}
                  className={`group relative flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                    selectedBlockId === block.id ? 'bg-gray-50' : ''
                  } ${
                    dragOverBlockId === block.id ? 'bg-blue-100 border-2 border-blue-300' : ''
                  } ${
                    draggedBlockId === block.id ? 'opacity-50' : ''
                  }`}
                  onClick={() => setSelectedBlockId(block.id)}
                >
                  {/* Ícone de arrastar - apenas 3 pontos verticais */}
                  <div className="flex items-center justify-center w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Conteúdo do bloco com altura adaptativa */}
                  <div className="flex-1 min-w-0">
                    {block.type === 'title' && (
                      <textarea
                        value={block.content}
                        onChange={(e) => handleBlockInput(block.id, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, block.id)}
                        placeholder="Título..."
                        className="w-full text-2xl font-bold text-gray-900 border-none outline-none bg-transparent resize-none overflow-hidden"
                        style={{
                          height: '2.5rem',
                          lineHeight: '2.5rem'
                        }}
                        onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
                        onFocus={() => setSelectedBlockId(block.id)}
                      />
                    )}
                    
                    {block.type === 'text' && (
                      <textarea
                        value={block.content}
                        onChange={(e) => handleBlockInput(block.id, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, block.id)}
                        placeholder="Digite seu texto..."
                        className="w-full text-base text-gray-700 border-none outline-none bg-transparent resize-none overflow-hidden"
                        style={{
                          height: '1.5rem',
                          lineHeight: '1.5rem'
                        }}
                        onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
                        onFocus={() => setSelectedBlockId(block.id)}
                      />
                    )}
                    
                    {block.type === 'checklist' && (
                      <div className="flex items-start gap-3 w-full">
                        <input
                          type="checkbox"
                          checked={block.completed || false}
                          onChange={() => handleChecklistToggle(block.id)}
                          className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <textarea
                          value={block.content}
                          onChange={(e) => handleBlockInput(block.id, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, block.id)}
                          placeholder="Item da lista..."
                          className={`flex-1 text-base border-none outline-none bg-transparent resize-none overflow-hidden ${
                            block.completed ? 'line-through text-gray-500' : 'text-gray-700'
                          }`}
                          style={{
                            height: '1.5rem',
                            lineHeight: '1.5rem'
                          }}
                          onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
                          onFocus={() => setSelectedBlockId(block.id)}
                        />
                      </div>
                    )}
                    
                    {block.type === 'tag' && (
                      <textarea
                        value={block.content}
                        onChange={(e) => handleBlockInput(block.id, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, block.id)}
                        placeholder="Tag..."
                        className="w-full text-base text-blue-600 border-none outline-none bg-transparent resize-none overflow-hidden"
                        style={{
                          height: '1.5rem',
                          lineHeight: '1.5rem'
                        }}
                        onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
                        onFocus={() => setSelectedBlockId(block.id)}
                      />
                    )}
                  </div>

                  {/* Botão de excluir mais sutil */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlock(block.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-100 hover:text-gray-500 rounded transition-all text-gray-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Botão para adicionar novo bloco */}
            <div className="mt-6 p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <span>Clique na barra de formatação para adicionar um novo bloco</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
