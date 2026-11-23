"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
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
        <Card>
          <CardContent className="flex flex-col gap-2 p-5">
            <p className="text-body-sm font-medium text-ink-muted">Total Sales</p>
            <p className="text-h2 text-ink">{formatCurrency(data.totalSales)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 p-5">
            <p className="text-body-sm font-medium text-ink-muted">Total Orders</p>
            <p className="text-h2 text-ink">{data.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 p-5">
            <p className="text-body-sm font-medium text-ink-muted">Avg. Order Value</p>
            <p className="text-h2 text-ink">{formatCurrency(data.avgOrderValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col gap-2 p-5">
            <p className="text-body-sm font-medium text-ink-muted">Conversion Rate</p>
            <p className="text-h2 text-ink">{data.conversionRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <CardTitle>Sales over time</CardTitle>
          <p className="text-body-sm text-ink-muted">Weekly sales totals for the current month.</p>
        </CardHeader>
        <CardContent>
          <div className="h-[160px] w-full">
            <RevenueTrendChart data={data.weeklySales} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
        </CardContent>
      </Card>
    </>
  );
}
