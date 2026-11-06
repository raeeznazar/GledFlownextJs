import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <rect width="36" height="36" rx="10" fill="var(--brand)" />
        <path
          d="M18 9.5C13.86 9.5 10.5 12.86 10.5 17s3.36 7.5 7.5 7.5c3.42 0 6.3-2.3 7.2-5.43H18v-2.7h9.17c.1.59.16 1.2.16 1.83 0 5.6-3.98 9.8-9.33 9.8-5.6 0-10.13-4.53-10.13-10.1S12.4 7.3 18 7.3c2.76 0 5.08 1.01 6.86 2.67l-2 2A6.62 6.62 0 0 0 18 9.5Z"
          fill="white"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-[15px] font-bold text-ink">Gled Flow</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
          Business OS
        </span>
      </div>
    </div>
  );
}
