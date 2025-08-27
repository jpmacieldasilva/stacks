"use client";
import React from "react";

export type TagColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'gray';

export interface TagData {
  id: string;
  name: string;
  color: TagColor;
}

type TagProps = {
  tag: TagData;
  selected?: boolean;
  removable?: boolean;
  onClick?: (tag: TagData) => void;
  onRemove?: (tag: TagData) => void;
  className?: string;
};

export function Tag({ tag, selected = false, removable = false, onClick, onRemove, className }: TagProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(tag);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(tag);
  };

  return (
    <span
      className={`tag tag-${tag.color} ${selected ? 'selected' : ''} ${className ?? ''}`}
      onClick={handleClick}
      title={tag.name}
    >
      <span>{tag.name}</span>
      {removable && (
        <span
          className="tag-remove"
          onClick={handleRemove}
          title="Remover tag"
        >
          ×
        </span>
      )}
    </span>
  );
}

type TagInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
};

export function TagInput({ value, onChange, onSubmit, onCancel, placeholder = "Nova tag...", className }: TagInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit(value.trim());
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <input
      type="text"
      className={`tag-input ${className ?? ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleSubmit}
      placeholder={placeholder}
      autoFocus
    />
  );
}

type TagListProps = {
  tags: TagData[];
  selectedTags?: string[];
  removable?: boolean;
  onTagClick?: (tag: TagData) => void;
  onTagRemove?: (tag: TagData) => void;
  className?: string;
};

export function TagList({ tags, selectedTags = [], removable = false, onTagClick, onTagRemove, className }: TagListProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      {tags.map((tag) => (
        <Tag
          key={tag.id}
          tag={tag}
          selected={selectedTags.includes(tag.id)}
          removable={removable}
          onClick={onTagClick}
          onRemove={onTagRemove}
        />
      ))}
    </div>
  );
}

// Utility function to get random tag color
export function getRandomTagColor(): TagColor {
  const colors: TagColor[] = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Utility function to create a new tag
export function createTag(name: string, color?: TagColor): TagData {
  return {
    id: Date.now().toString(),
    name,
    color: color || getRandomTagColor()
  };
}
