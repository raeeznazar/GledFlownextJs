"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { RevenueTrendChart } from "@/components/features/dashboard/RevenueTrendChart";
import { useAnalyticsSales } from "@/hooks/use-analytics";
import { formatCurrency } from "@/lib/utils";

export default function SalesAnalyticsPage() {
  const { data, isLoading } = useAnalyticsSales();

  if (isLoading || !data) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const maxSpent = Math.max(...data.topCustomers.map((c) => c.totalSpent), 1);

  return (
    <>
      <PageHeader
        title="Sales Analytics"
        description="Track and analyze your business transaction trends and top customers."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Total Sales</p>
          <p className="text-h2 font-bold text-ink">{formatCurrency(data.totalSales)}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Total Orders</p>
          <p className="text-h2 font-bold text-ink">{data.totalOrders}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Avg. Order Value</p>
          <p className="text-h2 font-bold text-ink">{formatCurrency(data.avgOrderValue)}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Conversion Rate</p>
          <p className="text-h2 font-bold text-ink">{data.conversionRate}%</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-[var(--radius-md)] border border-border bg-card p-5">
        <div className="flex flex-col gap-1">
          <p className="text-body font-bold text-ink">Sales over time</p>
          <p className="text-body-sm text-ink-muted">
            Weekly sales totals for the current month.
          </p>
        </div>
        <div className="h-[160px] w-full">
          <RevenueTrendChart data={data.weeklySales} />
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-border bg-card p-5">
        <p className="text-body font-bold text-ink">Top Customers</p>
        <div className="flex flex-col gap-4">
          {data.topCustomers.map((c) => (
            <div key={c.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-body-sm">
                <span className="font-medium text-ink">{c.name}</span>
                <span className="font-semibold text-ink">
                  {formatCurrency(c.totalSpent)} · {c.totalOrders} orders
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-200">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${Math.max(4, (c.totalSpent / maxSpent) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
