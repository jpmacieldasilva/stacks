"use client";
import React, { useState, useRef, useCallback } from "react";

type UploadAreaProps = {
  onFileUpload: (file: File, position: { x: number; y: number }) => void;
  className?: string;
};

export function UploadArea({ onFileUpload, className }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only hide drag overlay if we're leaving the upload area completely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left + 100,
        y: e.clientY - rect.top + 100
      };
      
      // Process first file
      onFileUpload(files[0], position);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const position = {
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 200
      };
      
      onFileUpload(files[0], position);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div
        className={`upload-area ${isDragOver ? 'dragover' : ''} ${className ?? ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl">📁</div>
          <div className="text-sm font-medium text-gray-700">
            {isDragOver ? 'Solte o arquivo aqui' : 'Arraste arquivos ou clique para fazer upload'}
          </div>
          <div className="text-xs text-gray-500">
            Suporte a imagens, PDFs e links
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,text/uri-list"
        onChange={handleFileSelect}
      />
    </>
  );
}
