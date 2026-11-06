"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-[420px]",
  md: "max-w-[560px]",
  lg: "max-w-[720px]",
};

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className="absolute inset-0 bg-surface-inverse"
        style={{ opacity: "var(--opacity-overlay)" }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative w-full rounded-[var(--radius-lg)] bg-card shadow-md animate-in",
          sizeClasses[size]
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
            <div className="flex flex-col gap-1">
              {title && (
                <h2 id="modal-title" className="text-h3 text-ink">
                  {title}
                </h2>
              )}
              {description && <p className="text-body-sm text-ink-muted">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-[var(--radius-sm)] p-1.5 text-ink-faint hover:bg-surface-100 hover:text-ink transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        <div className="px-6 pb-6">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border rounded-b-[var(--radius-lg)]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
