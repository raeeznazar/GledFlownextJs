"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export function Drawer({ open, onClose, title, children, footer, width = 450 }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-surface-inverse"
        style={{ opacity: "var(--opacity-overlay)" }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative flex h-full w-full max-w-[450px] flex-col bg-card shadow-md animate-in-right"
        )}
        style={{ width }}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="text-h3 text-ink">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex size-8 items-center justify-center rounded-full bg-surface-100 text-ink-muted hover:text-ink"
            >
              <XCircle className="size-[18px]" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && <div className="flex items-center gap-3 border-t border-border p-6">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
