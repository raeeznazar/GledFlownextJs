"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  sublabel?: string;
  icon?: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  fullWidth,
  className,
}: SegmentedControlProps<T>) {
  const hasIcons = options.some((o) => o.icon);

  return (
    <div
      className={cn(
        "flex gap-1.5 rounded-[var(--radius-sm)]",
        !hasIcons && "gap-1 bg-surface-100 p-1",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={cn(
              "flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-semibold transition-colors",
              fullWidth && "flex-1",
              hasIcons
                ? cn(
                    "border p-3 text-left",
                    active
                      ? "border-2 border-brand bg-brand-subtle"
                      : "border-border bg-surface-0 hover:bg-surface-100"
                  )
                : cn(
                    "px-3 py-1.5 text-body-sm capitalize",
                    active ? "bg-card text-ink shadow-sm" : "text-ink-muted hover:text-ink"
                  )
            )}
          >
            {opt.icon && (
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-[var(--radius-sm)]",
                  active ? "bg-brand text-brand-ink" : "bg-surface-100 text-ink-muted"
                )}
              >
                {opt.icon}
              </span>
            )}
            <span className="flex flex-col leading-tight">
              <span className={hasIcons ? "text-label text-ink" : undefined}>{opt.label}</span>
              {opt.sublabel && <span className="text-caption text-ink-muted">{opt.sublabel}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
