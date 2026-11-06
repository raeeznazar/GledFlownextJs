"use client";

import { Menu, Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/stores/auth-store";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface-0 px-4 lg:px-8">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        className="lg:hidden text-ink-muted hover:text-ink"
      >
        <Menu className="size-5" />
      </button>

      <div className="hidden sm:block max-w-[320px] flex-1">
        <Input placeholder="Search transactions, customers…" leftIcon={<Search />} />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-[var(--radius-sm)] text-ink-muted hover:bg-surface-100 hover:text-ink transition-colors"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger" />
        </button>
        <Dropdown
          align="right"
          trigger={
            <span className="flex items-center gap-2 pl-1">
              <Avatar name={user?.name ?? "Admin"} size="sm" />
            </span>
          }
          items={[
            { label: "Profile", onSelect: () => {} },
            { label: "Settings", onSelect: () => {} },
            { label: "Log out", onSelect: logout, danger: true },
          ]}
        />
      </div>
    </header>
  );
}
