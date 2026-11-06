"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-brand-ink hover:bg-brand-hover active:opacity-[var(--opacity-hover-fill)] disabled:bg-disabled disabled:text-ink-faint",
  secondary:
    "bg-surface-100 text-ink hover:bg-surface-200 border border-border disabled:text-ink-faint",
  outline:
    "bg-transparent text-ink border border-border hover:bg-surface-100 disabled:text-ink-faint",
  ghost: "bg-transparent text-ink hover:bg-surface-100 disabled:text-ink-faint",
  danger: "bg-danger text-white hover:opacity-90 disabled:bg-disabled disabled:text-ink-faint",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-10 px-4 text-button gap-2 rounded-[var(--radius-md)]",
  lg: "h-12 px-5 text-[15px] gap-2 rounded-[var(--radius-md)]",
  icon: "h-10 w-10 p-0 rounded-[var(--radius-sm)] justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center font-semibold leading-5 transition-colors duration-150",
          "disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
