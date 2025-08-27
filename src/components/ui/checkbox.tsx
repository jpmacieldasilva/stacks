"use client";
import React from "react";

interface CheckboxProps {
  checked?: boolean;
  className?: string;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function Checkbox({ checked = false, className = "", onMouseDown }: CheckboxProps) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      className={`w-3 h-3 border border-gray-400 rounded-sm flex items-center justify-center cursor-pointer hover:border-gray-600 transition-colors ${
        checked ? 'bg-blue-500 border-blue-500' : 'bg-transparent'
      } ${className}`}
      onMouseDown={onMouseDown}
    >
      {checked && (
        <svg
          className="w-2 h-2 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}
