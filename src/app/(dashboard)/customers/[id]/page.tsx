"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "@/components/ui/Table";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCustomer } from "@/hooks/use-customers";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomerDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: customer, isLoading } = useCustomer(params.id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-body text-ink-muted">Customer not found.</p>
        <Button variant="outline" onClick={() => router.push("/customers")}>
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/customers")}
          aria-label="Back to customers"
          className="flex items-center justify-center rounded-[var(--radius-full)] border border-border bg-card p-2 text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
        </button>
        <Avatar name={customer.name} size="lg" />
        <h1 className="text-h1 text-ink">{customer.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Total Sales</p>
          <p className="text-h2 font-bold text-ink">{formatCurrency(customer.totalSpent)}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Transactions</p>
          <p className="text-h2 font-bold text-ink">{customer.totalOrders}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-card p-5">
          <p className="text-body-sm font-medium text-ink-muted">Last Purchase</p>
          <p className="text-h2 font-bold text-ink">
            {customer.lastOrderAt ? formatDate(customer.lastOrderAt) : "—"}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[#fed7aa] bg-[#fff7ed] p-5">
          <p className="text-body-sm font-medium text-[#c2410c]">Status</p>
          <p className="text-h2 font-bold text-[#c2410c] capitalize">{customer.status}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-10 rounded-[var(--radius-md)] border border-border bg-card p-6">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-normal uppercase text-ink-muted">Phone</p>
          <p className="text-body-sm font-medium text-ink">{customer.phone}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-normal uppercase text-ink-muted">Email</p>
          <p className="text-body-sm font-medium text-ink">{customer.email || "—"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-normal uppercase text-ink-muted">Company</p>
          <p className="text-body-sm font-medium text-ink">{customer.company || "—"}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-normal uppercase text-ink-muted">Customer Since</p>
          <p className="text-body-sm font-medium text-ink">{formatDate(customer.createdAt)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-h3 font-bold text-ink">Transaction History</h2>
        <div className="bg-card rounded-[var(--radius-md)]">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell className="w-[140px]">Date</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell className="w-[120px]">Type</TableHeadCell>
                <TableHeadCell className="w-[120px] text-right">Amount</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customer.orders.length ? (
                customer.orders.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-ink-muted">{formatDate(t.date)}</TableCell>
                    <TableCell className="font-semibold">{t.categoryName}</TableCell>
                    <TableCell>
                      <Badge tone={t.type === "income" ? "brand" : "warning"}>
                        {t.type === "income" ? "Income" : "Expense"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-ink-muted">
                    No transactions recorded for this customer yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
