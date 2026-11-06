"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom";
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={cn(
            "absolute z-50 whitespace-nowrap rounded-[var(--radius-sm)] bg-surface-inverse px-2.5 py-1.5 text-caption text-surface-0 shadow-sm pointer-events-none",
            "left-1/2 -translate-x-1/2",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
