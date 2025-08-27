import React, { forwardRef } from "react";
import { Card } from "@/components/ui/card";

type CardBaseProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
  'aria-selected'?: boolean;
};

export const CardBase = forwardRef<HTMLDivElement, CardBaseProps>(
  ({ 
    children, 
    className, 
    style, 
    onMouseDown, 
    onClick, 
    onKeyDown,
    tabIndex = 0,
    role = "button",
    'aria-label': ariaLabel,
    'aria-selected': ariaSelected
  }, ref) => {
    return (
      <Card
        ref={ref}
        className={`card-base card-hover ${className ?? ""}`}
        style={style}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel}
        aria-selected={ariaSelected}
      >
        {children}
      </Card>
    );
  }
);

CardBase.displayName = "CardBase";
