import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/layout/BrandMark";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <BrandMark className="shrink-0" />
      <div className="flex flex-col leading-tight">
        <span className="text-[15px] font-bold text-ink">Gled Flow</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
          Business OS
        </span>
      </div>
    </div>
  );
}
