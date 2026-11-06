import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-[var(--radius-md)] border border-dashed border-border bg-card py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-brand-subtle text-brand">
        <Icon className="size-6" />
      </div>
      <div className="flex max-w-[420px] flex-col gap-1.5">
        <p className="text-h3 font-bold text-ink">{title}</p>
        <p className="text-body-sm text-ink-muted">{description}</p>
      </div>
    </div>
  );
}
