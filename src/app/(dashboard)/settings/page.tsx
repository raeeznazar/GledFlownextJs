"use client";

import { useRouter } from "next/navigation";
import { LogOut, Moon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/layout/ComingSoon";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuthStore } from "@/stores/auth-store";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your account and app preferences."
      />

      <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-card p-6">
        <p className="text-body font-bold text-ink">Account</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name ?? "?"} size="lg" />
            <div className="flex flex-col">
              <p className="text-body font-semibold text-ink">{user?.name}</p>
              <p className="text-body-sm text-ink-muted">{user?.email}</p>
            </div>
          </div>
          {user && (
            <Badge tone="brand" className="capitalize">
              {user.role}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-card p-6">
        <p className="text-body font-bold text-ink">Appearance</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="size-4 text-ink-muted" />
            <div className="flex flex-col">
              <p className="text-body-sm font-semibold text-ink">Theme</p>
              <p className="text-caption text-ink-muted">
                Switch between light and dark mode. Your choice is remembered on this device.
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-card p-6">
        <p className="text-body font-bold text-ink">Session</p>
        <div className="flex items-center justify-between">
          <p className="text-body-sm text-ink-muted">Sign out of Gled Flow on this device.</p>
          <Button variant="outline" leftIcon={<LogOut className="size-4" />} onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>

      <ComingSoon
        icon={Moon}
        title="Business settings coming soon"
        description="Business profile, billing details, invoice numbering, and notification preferences are on the roadmap."
      />
    </div>
  );
}
