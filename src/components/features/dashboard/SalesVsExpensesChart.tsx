import type { SalesExpensePoint } from "@/types";

export function SalesVsExpensesChart({ data }: { data: SalesExpensePoint[] }) {
  const max = Math.max(...data.flatMap((d) => [d.sales, d.expenses]), 1);

  return (
    <div className="flex h-[110px] w-full items-end justify-between gap-2">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-20 items-end gap-1">
            <div
              className="w-3.5 rounded-t-[3px] bg-brand"
              style={{ height: `${Math.max(6, (d.sales / max) * 80)}px` }}
              title={`Sales: ${d.sales}`}
            />
            <div
              className="w-3.5 rounded-t-[3px] bg-border-strong"
              style={{ height: `${Math.max(6, (d.expenses / max) * 80)}px` }}
              title={`Expenses: ${d.expenses}`}
            />
          </div>
          <p className="text-[11px] text-ink-muted">{d.label}</p>
        </div>
      ))}
    </div>
  );
}
