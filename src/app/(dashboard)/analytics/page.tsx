"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { SalesVsExpensesChart } from "@/components/features/dashboard/SalesVsExpensesChart";
import { useAnalyticsOverview } from "@/hooks/use-analytics";
import { formatCurrency } from "@/lib/utils";

function ChangeBadge({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-1.5 py-0.5 text-[11px] font-semibold ${
        up ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
      }`}
    >
      {up ? "↑" : "↓"} {Math.abs(value)}
      {suffix}
    </span>
  );
}

export default function AnalyticsOverviewPage() {
  const { data, isLoading } = useAnalyticsOverview();

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const trend = data.monthlyTrend;
  const last = trend[trend.length - 1];
  const prev = trend[trend.length - 2] ?? last;
  const pct = (curr: number, prior: number) =>
    prior ? Math.round(((curr - prior) / prior) * 100) : 0;

  const revenueChange = pct(last.income, prev.income);
  const expenseChange = pct(last.expense, prev.expense);
  const profit = data.netProfit;
  const prevProfit = prev.income - prev.expense;
  const profitChange = pct(profit, prevProfit);
  const prevMargin = prev.income ? Math.round(((prev.income - prev.expense) / prev.income) * 100) : 0;
  const marginChange = data.margin - prevMargin;

  const topProducts = data.byCategory
    .filter((c) => c.type === "income")
    .slice(0, 3);
  const topCategory = topProducts[0];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Live printing operations profitability and product data insights."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Revenue</p>
          <div className="flex items-baseline justify-between">
            <p className="text-h2 font-bold text-ink">{formatCurrency(data.totalIncome)}</p>
            <ChangeBadge value={revenueChange} />
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Expenses</p>
          <div className="flex items-baseline justify-between">
            <p className="text-h2 font-bold text-ink">{formatCurrency(data.totalExpense)}</p>
            <ChangeBadge value={expenseChange} />
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Profit</p>
          <div className="flex items-baseline justify-between">
            <p className="text-h2 font-bold text-ink">{formatCurrency(profit)}</p>
            <ChangeBadge value={profitChange} />
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Margin</p>
          <div className="flex items-baseline justify-between">
            <p className="text-h2 font-bold text-ink">{data.margin}%</p>
            <ChangeBadge value={marginChange} suffix="pts" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-[var(--radius-md)] border border-border bg-card p-5">
        <div className="flex flex-col gap-1">
          <p className="text-body font-bold text-ink">Revenue vs Expenses</p>
          <p className="text-body-sm text-ink-muted">
            Monthly totals for income versus expense categories over the last six months.
          </p>
        </div>
        <SalesVsExpensesChart
          data={trend.map((t) => ({ label: t.label, sales: t.income, expenses: t.expense }))}
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-brand" />
            <span className="text-caption text-ink-muted">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-border-strong" />
            <span className="text-caption text-ink-muted">Expenses</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body font-bold text-ink">Top Products</p>
          <div className="flex flex-col gap-3">
            {topProducts.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-body-sm">
                <span className="text-ink">{p.name}</span>
                <span className="font-semibold text-ink">{formatCurrency(p.total)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body font-bold text-ink">Business Insights</p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />
              <p className="text-body-sm leading-relaxed text-ink-muted">
                Revenue {revenueChange >= 0 ? "increased" : "decreased"}{" "}
                <span className="font-semibold text-ink">{Math.abs(revenueChange)}%</span>{" "}
                compared with last month.
              </p>
            </div>
            {topCategory && (
              <div className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-success" />
                <p className="text-body-sm leading-relaxed text-ink-muted">
                  <span className="font-semibold text-ink">{topCategory.name}</span> is your
                  highest-earning category this period, bringing in{" "}
                  {formatCurrency(topCategory.total)}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
