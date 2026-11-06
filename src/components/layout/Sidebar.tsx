"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navItems } from "@/lib/navigation";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();

  const content = (
    <>
      <div className="flex items-center justify-between px-4 pt-6 pb-5">
        <Logo />
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation"
          className="lg:hidden text-ink-faint hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="mx-4 h-px bg-border" />
      <nav className="flex flex-col gap-1 px-4 py-5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex h-[38px] items-center gap-3 rounded-[var(--radius-sm)] px-3 text-[14px] font-medium transition-colors",
                active
                  ? "bg-brand text-brand-ink font-semibold"
                  : "text-ink hover:bg-surface-100"
              )}
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={2} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-[240px] lg:shrink-0 lg:flex-col lg:self-stretch lg:border-r lg:border-border lg:bg-surface-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-surface-inverse"
            style={{ opacity: "var(--opacity-overlay)" }}
            onClick={onCloseMobile}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 h-full w-[260px] flex flex-col bg-surface-0 shadow-md animate-in">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
