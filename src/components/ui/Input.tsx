"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-ink-faint [&_svg]:size-4">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "h-10 w-full rounded-[var(--radius-sm)] border border-border bg-input px-3 text-[15px] text-ink placeholder:text-ink-faint",
              "transition-colors duration-150 outline-none",
              "focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20",
              "disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)] disabled:bg-disabled",
              error && "border-danger focus-visible:ring-danger/20",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-ink-faint [&_svg]:size-4">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-caption text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
