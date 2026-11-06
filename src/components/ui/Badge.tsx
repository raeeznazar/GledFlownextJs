import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface-100 text-ink-muted border-border",
  success: "bg-success-bg text-success border-success/20",
  warning: "bg-warning-bg text-warning border-warning/20",
  danger: "bg-danger-bg text-danger border-danger/20",
  info: "bg-info-bg text-info border-info/20",
  brand: "bg-brand-subtle text-brand border-brand/20",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
}

export function Badge({ className, tone = "neutral", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border px-2.5 py-1 text-caption font-medium whitespace-nowrap",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="size-1.5 rounded-full bg-current" aria-hidden />
      )}
      {children}
    </span>
  );
}
