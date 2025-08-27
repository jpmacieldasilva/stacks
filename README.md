# Stacks - Aplicativo de Anotações Inteligentes

## Funcionalidades Implementadas

## 🖼️ **Redimensionamento de Imagens**

### **Sistema de Botões Incrementais**
As imagens agora podem ser redimensionadas usando botões incrementais simples e confiáveis:

- **Botão Azul (+)** : Aumenta o tamanho em 50px
- **Botão Cinza (−)** : Diminui o tamanho em 50px
- **Limites de Tamanho**:
  - **Mínimo**: 100 × 100 pixels
  - **Máximo**: 800 × 600 pixels
  - **Incremento**: 50 pixels por clique

### **Como Usar**
1. **Passe o mouse** sobre uma imagem para revelar os botões
2. **Clique no botão +** para aumentar o tamanho
3. **Clique no botão −** para diminuir o tamanho
4. **Indicador de tamanho** aparece no canto superior esquerdo no hover

### **Características**
- ✅ **Sistema confiável** baseado em botões (não em drag & drop)
- ✅ **Incrementos consistentes** de 50px
- ✅ **Limites de segurança** para evitar tamanhos extremos
- ✅ **Interface limpa** sem handles visuais desnecessários
- ✅ **Feedback visual** com indicador de tamanho atual
- ✅ **Botões desabilitados** quando atingem limites

### **Vantagens da Nova Abordagem**
- **Mais confiável** que drag & drop
- **Controle preciso** do tamanho
- **Interface mais limpa** e intuitiva
- **Funciona em todos os dispositivos** (desktop e mobile)
- **Sem conflitos** com funcionalidade de movimento

### Outras Funcionalidades
- Sistema de cards (sticky notes, imagens, PDFs, links)
- Upload de arquivos
- Sistema de tags
- Busca semântica
- Zoom e pan no canvas
- Seleção múltipla de cards

## Tecnologias
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui

## Como Executar
```bash
npm install
npm run dev
```

## Estrutura do Projeto
- `/src/components/board/` - Componentes do canvas
- `/src/contexts/` - Contextos React para estado global
- `/src/hooks/` - Hooks customizados
- `/src/types/` - Definições de tipos TypeScript
