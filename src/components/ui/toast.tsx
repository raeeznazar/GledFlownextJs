"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "warning" | "danger" | "info";

interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastContextValue {
  show: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toneConfig: Record<ToastTone, { icon: typeof Info; className: string }> = {
  success: { icon: CheckCircle2, className: "text-success" },
  warning: { icon: AlertTriangle, className: "text-warning" },
  danger: { icon: XCircle, className: "text-danger" },
  info: { icon: Info, className: "text-info" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[340px]">
            {toasts.map((toast) => {
              const { icon: Icon, className } = toneConfig[toast.tone];
              return (
                <div
                  key={toast.id}
                  role="status"
                  className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-card p-4 shadow-md animate-in"
                >
                  <Icon className={cn("size-5 shrink-0 mt-0.5", className)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-emphasis text-ink">{toast.title}</p>
                    {toast.description && (
                      <p className="text-body-sm text-ink-muted mt-0.5">{toast.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(toast.id)}
                    aria-label="Dismiss"
                    className="text-ink-faint hover:text-ink"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
