"use client";
import React, { useState } from "react";
import { TagData } from "@/types/board";
import { Tag, TagInput, TagList, createTag } from "@/components/ui/Tag";

type TagManagerProps = {
  availableTags: TagData[];
  selectedTags: string[];
  onAddTag: (tag: TagData) => void;
  onRemoveTag: (tagId: string) => void;
  onSelectTag: (tagId: string) => void;
  onUnselectTag: (tagId: string) => void;
  className?: string;
};

export function TagManager({ 
  availableTags, 
  selectedTags, 
  onAddTag, 
  onRemoveTag, 
  onSelectTag, 
  onUnselectTag,
  className 
}: TagManagerProps) {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const handleTagClick = (tag: TagData) => {
    if (selectedTags.includes(tag.id)) {
      onUnselectTag(tag.id);
    } else {
      onSelectTag(tag.id);
    }
  };

  const handleAddTag = (name: string) => {
    const newTag = createTag(name);
    onAddTag(newTag);
    onSelectTag(newTag.id);
    setNewTagName("");
    setIsAddingTag(false);
  };

  const handleCancelAdd = () => {
    setNewTagName("");
    setIsAddingTag(false);
  };

  return (
    <div className={`flex flex-col gap-3 ${className ?? ''}`}>
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map(tagId => {
            const tag = availableTags.find(t => t.id === tagId);
            return tag ? (
              <Tag
                key={tag.id}
                tag={tag}
                selected={true}
                removable={true}
                onClick={() => onUnselectTag(tag.id)}
                onRemove={() => onUnselectTag(tag.id)}
              />
            ) : null;
          })}
        </div>
      )}

      {/* Available tags */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {availableTags
            .filter(tag => !selectedTags.includes(tag.id))
            .map(tag => (
              <Tag
                key={tag.id}
                tag={tag}
                onClick={() => onSelectTag(tag.id)}
              />
            ))}
        </div>
      )}

      {/* Add new tag */}
      <div className="flex items-center gap-2">
        {isAddingTag ? (
          <TagInput
            value={newTagName}
            onChange={setNewTagName}
            onSubmit={handleAddTag}
            onCancel={handleCancelAdd}
            placeholder="Nome da tag..."
          />
        ) : (
          <button
            onClick={() => setIsAddingTag(true)}
            className="tag-input"
          >
            + Nova tag
          </button>
        )}
      </div>
    </div>
  );
}
