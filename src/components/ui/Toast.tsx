"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastColors = {
  success: "border-green-500 bg-green-50 text-green-800",
  error: "border-red-500 bg-red-50 text-red-800",
  warning: "border-yellow-500 bg-yellow-50 text-yellow-800",
  info: "border-blue-500 bg-blue-50 text-blue-800",
};

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
};

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Aguardar animação terminar
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const Icon = toastIcons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-5 right-5 z-50 max-w-sm w-full border rounded-lg p-4 shadow-lg ${toastColors[type]}`}
        >
          <div className="flex items-start gap-3">
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[type]}`} />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{title}</h4>
              {message && (
                <p className="text-sm mt-1 opacity-90">{message}</p>
              )}
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(id), 300);
              }}
              className="ml-2 p-1 rounded-md hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook para gerenciar múltiplos toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (title: string, message?: string) => {
    addToast({ type: "success", title, message });
  };

  const showError = (title: string, message?: string) => {
    addToast({ type: "error", title, message });
  };

  const showWarning = (title: string, message?: string) => {
    addToast({ type: "warning", title, message });
  };

  const showInfo = (title: string, message?: string) => {
    addToast({ type: "info", title, message });
  };

  return {
    toasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}

// Componente container para múltiplos toasts
export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 p-5 space-y-3">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}
