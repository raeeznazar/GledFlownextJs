"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SkeletonCard, SkeletonRow } from "@/components/ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "@/components/ui/Table";
import { KpiCard } from "@/components/features/dashboard/KpiCard";
import { RevenueTrendChart } from "@/components/features/dashboard/RevenueTrendChart";
import { SalesVsExpensesChart } from "@/components/features/dashboard/SalesVsExpensesChart";
import { useDashboard } from "@/hooks/use-dashboard";
import { formatCurrency } from "@/lib/utils";
import { AddTransactionModal } from "@/components/features/transactions/AddTransactionModal";
import { useAuthStore } from "@/stores/auth-store";

type TxnFilter = "all" | "income" | "expense";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const [filter, setFilter] = useState<TxnFilter>("all");
  const [addOpen, setAddOpen] = useState(false);
  const user = useAuthStore((s) => s.user);

  const transactions = (data?.recentTransactions ?? []).filter(
    (t) => filter === "all" || t.type === filter
  );

  return (
    <>
      <PageHeader
        title={`Good morning, ${user?.name.split(" ")[0] ?? data?.greetingName ?? "Admin"}`}
        description="Manage your printing press operations with live insights."
        action={
          <Button leftIcon={<Plus className="size-4" />} onClick={() => setAddOpen(true)}>
            Add Transaction
          </Button>
        }
      />

      <div className="flex flex-wrap gap-4">
        {isLoading || !data
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : [
              { label: "Today's Sales", value: data.kpis.todaySales, change: data.kpis.todaySalesChange },
              { label: "Today's Income", value: data.kpis.todayIncome, change: data.kpis.todayIncomeChange },
              { label: "Today's Expenses", value: data.kpis.todayExpenses, change: data.kpis.todayExpensesChange },
              { label: "Today's Profit", value: data.kpis.todayProfit, change: data.kpis.todayProfitChange },
            ].map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Transactions</CardTitle>
          <div className="flex gap-1 rounded-[var(--radius-sm)] bg-surface-100 p-0.5">
            {(["all", "income", "expense"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-[4px] px-3 py-1.5 text-[12px] font-semibold capitalize transition-colors ${
                  filter === f ? "bg-surface-0 text-ink shadow-sm" : "text-ink-muted"
                }`}
              >
                {f === "all" ? "All" : f === "income" ? "Incomes" : "Expenses"}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonRow key={i} cols={5} />
              ))}
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Time</TableHeadCell>
                  <TableHeadCell>Customer</TableHeadCell>
                  <TableHeadCell>Category</TableHeadCell>
                  <TableHeadCell>Type</TableHeadCell>
                  <TableHeadCell className="text-right">Amount</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-ink-muted py-8">
                      No transactions yet today.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-ink-muted">{t.time}</TableCell>
                      <TableCell className="font-semibold">{t.customerName}</TableCell>
                      <TableCell className="text-ink-muted">{t.categoryName}</TableCell>
                      <TableCell>
                        <Badge tone={t.type === "income" ? "success" : "danger"}>
                          {t.type === "income" ? "Income" : "Expense"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-col items-start gap-1">
            <CardTitle>Revenue Trend</CardTitle>
            <p className="text-body-sm text-ink-muted">
              Revenue increased 18% compared with the previous period.
            </p>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <div className="h-[150px] animate-pulse rounded-md bg-surface-100" />
            ) : (
              <RevenueTrendChart data={data.revenueTrend} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-col items-start gap-1">
            <CardTitle>Sales vs Expenses</CardTitle>
            <p className="text-body-sm text-ink-muted">
              This week&apos;s revenue is running well ahead of expenses.
            </p>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <div className="h-[110px] animate-pulse rounded-md bg-surface-100" />
            ) : (
              <SalesVsExpensesChart data={data.salesVsExpenses} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {(data?.topProducts ?? []).map((p) => (
              <div key={p.name} className="flex items-center justify-between text-[14px]">
                <span className="text-ink">{p.name}</span>
                <span className="font-semibold text-ink">{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Business Insights</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {(data?.insights ?? []).map((insight, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="mt-1.5 size-2 shrink-0 rounded-full"
                  style={{
                    background:
                      insight.tone === "brand"
                        ? "var(--brand)"
                        : insight.tone === "danger"
                          ? "var(--danger)"
                          : "var(--success)",
                  }}
                />
                <p className="text-body-sm text-ink-muted">{insight.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
