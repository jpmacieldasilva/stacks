"use client";
import React from "react";
import { 
  LucideIcon, 
  Settings, 
  Grid, 
  Mouse, 
  Keyboard, 
  Eye, 
  EyeOff,
  Plus,
  Minus,
  Search,
  FileText,
  Image,
  Link,
  File,
  Tag,
  Trash2,
  Copy,
  Edit,
  Save,
  Cancel,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Move,
  Resize,
  Lock,
  Unlock,
  Star,
  Heart,
  Bookmark,
  Share,
  Download,
  Upload,
  Folder,
  Calendar,
  Clock,
  User,
  Users,
  Home,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

// Mapeamento de ícones por nome
const iconMap: Record<string, LucideIcon> = {
  // Navegação e controle
  settings: Settings,
  grid: Grid,
  mouse: Mouse,
  keyboard: Keyboard,
  eye: Eye,
  eyeOff: EyeOff,
  
  // Ações básicas
  plus: Plus,
  minus: Minus,
  search: Search,
  edit: Edit,
  save: Save,
  cancel: Cancel,
  check: Check,
  close: X,
  
  // Tipos de conteúdo
  fileText: FileText,
  image: Image,
  link: Link,
  file: File,
  folder: Folder,
  
  // Manipulação
  tag: Tag,
  trash: Trash2,
  copy: Copy,
  move: Move,
  resize: Resize,
  
  // Zoom e navegação
  zoomIn: ZoomIn,
  zoomOut: ZoomOut,
  rotateCcw: RotateCcw,
  rotateCw: RotateCw,
  
  // Direções
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  
  // Estados
  lock: Lock,
  unlock: Unlock,
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
  
  // Ações avançadas
  share: Share,
  download: Download,
  upload: Upload,
  
  // Informações
  calendar: Calendar,
  clock: Clock,
  user: User,
  users: Users,
  home: Home,
  
  // Interface
  menu: Menu,
  moreHorizontal: MoreHorizontal,
  moreVertical: MoreVertical,
  filter: Filter,
  sortAsc: SortAsc,
  sortDesc: SortDesc,
  refresh: RefreshCw,
  
  // Feedback
  alertCircle: AlertCircle,
  info: Info,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  alertTriangle: AlertTriangle
};

interface IconProps {
  name: keyof typeof iconMap;
  size?: number;
  className?: string;
  color?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function Icon({ 
  name, 
  size = 24, 
  className = "", 
  color = "currentColor",
  onClick,
  disabled = false
}: IconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const baseClasses = "transition-all duration-200";
  const interactiveClasses = onClick && !disabled 
    ? "cursor-pointer hover:scale-110 active:scale-95" 
    : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  const combinedClasses = `${baseClasses} ${interactiveClasses} ${disabledClasses} ${className}`.trim();

  return (
    <IconComponent
      size={size}
      className={combinedClasses}
      color={color}
      onClick={disabled ? undefined : onClick}
      style={{ minWidth: size, minHeight: size }}
    />
  );
}

// Componentes de ícones específicos para uso comum
export function IconButton({ 
  icon, 
  onClick, 
  size = 24, 
  className = "", 
  disabled = false,
  variant = "default"
}: {
  icon: keyof typeof iconMap;
  onClick?: () => void;
  size?: number;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "primary" | "secondary" | "danger" | "ghost";
}) {
  const variantClasses = {
    default: "p-2 rounded-lg hover:bg-gray-100 text-gray-600",
    primary: "p-2 rounded-lg hover:bg-blue-100 text-blue-600",
    secondary: "p-2 rounded-lg hover:bg-gray-100 text-gray-700",
    danger: "p-2 rounded-lg hover:bg-red-100 text-red-600",
    ghost: "p-2 rounded-lg hover:bg-transparent text-gray-500"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

// Componente de ícone com badge
export function IconWithBadge({ 
  icon, 
  badge, 
  size = 24, 
  className = "" 
}: {
  icon: keyof typeof iconMap;
  badge?: string | number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`relative inline-block ${className}`}>
      <Icon name={icon} size={size} />
      {badge && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {badge}
        </span>
      )}
    </div>
  );
}
