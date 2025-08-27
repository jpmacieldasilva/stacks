export interface Position {
  x: number;
  y: number;
}

export interface CardData {
  id: string;
  type: 'sticky' | 'paper' | 'image' | 'link' | 'pdf';
  position: Position;
  content: string;
  color?: 'pink' | 'yellow' | 'green' | 'purple' | 'blue' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  // Dimensões personalizadas para redimensionamento
  width?: number;
  height?: number;
  metadata?: Record<string, string | number | boolean>;
  tags?: string[]; // IDs das tags associadas
}



export interface BoardState {
  cards: CardData[];
  tags: TagData[];
  viewport: {
    scale: number;
    x: number;
    y: number;
  };
}

export interface TagData {
  id: string;
  name: string;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'gray';
}
