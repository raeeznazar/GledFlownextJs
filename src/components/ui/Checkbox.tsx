"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          "inline-flex items-center gap-2 text-body text-ink select-none",
          props.disabled && "opacity-[var(--opacity-disabled)] cursor-not-allowed"
        )}
      >
        <span className="relative inline-flex size-[18px] shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={cn(
              "peer size-[18px] appearance-none rounded-[var(--radius-sm)] border border-border-strong bg-input",
              "checked:bg-brand checked:border-brand",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
              "disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          <Check
            className="pointer-events-none absolute size-3 text-brand-ink opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
          />
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
