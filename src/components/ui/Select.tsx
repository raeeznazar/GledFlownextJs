"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "h-10 w-full appearance-none rounded-[var(--radius-sm)] border border-border bg-input px-3 pr-9 text-[15px] text-ink",
              "transition-colors duration-150 outline-none",
              "focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20",
              "disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]",
              error && "border-danger",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
        </div>
        {error && <p className="text-caption text-danger">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
