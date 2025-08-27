"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type UploadItem = {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
};

type UploadProgressProps = {
  uploads: UploadItem[];
};

export function UploadProgress({ uploads }: UploadProgressProps) {
  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-30 w-80">
      <AnimatePresence>
        {uploads.map((upload) => (
          <motion.div
            key={upload.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
          >
            {/* Header com ícone e nome do arquivo */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0">
                {upload.status === 'uploading' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {upload.status === 'completed' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                )}
                {upload.status === 'error' && (
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 text-sm">✕</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {upload.fileName}
                </div>
                <div className="text-xs text-gray-500">
                  {upload.status === 'uploading' && `${Math.round(upload.progress)}%`}
                  {upload.status === 'completed' && 'Upload concluído'}
                  {upload.status === 'error' && (upload.error || 'Erro no upload')}
                </div>
              </div>
            </div>

            {/* Barra de progresso */}
            {upload.status === 'uploading' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${upload.progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            )}

            {/* Barra de sucesso */}
            {upload.status === 'completed' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-full" />
              </div>
            )}

            {/* Barra de erro */}
            {upload.status === 'error' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full w-full" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
