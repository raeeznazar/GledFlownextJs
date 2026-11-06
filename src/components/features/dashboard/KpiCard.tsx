import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  change,
}: {
  label: string;
  value: number;
  change: number;
}) {
  const positive = change >= 0;
  return (
    <div className="flex flex-1 min-w-[150px] flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5 shadow-sm">
      <p className="text-label text-ink-muted">{label}</p>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[22px] font-bold text-ink whitespace-nowrap">
          {formatCurrency(value)}
        </p>
        <Badge tone={positive ? "success" : "danger"} className="shrink-0">
          {positive ? "+" : ""}
          {change}%
        </Badge>
      </div>
    </div>
  );
}
