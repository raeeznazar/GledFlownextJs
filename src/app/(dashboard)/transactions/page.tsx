"use client";

import { useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "@/components/ui/Table";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { AddTransactionModal } from "@/components/features/transactions/AddTransactionModal";
import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";
import { useCategories } from "@/hooks/use-categories";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { TransactionType } from "@/types";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [type, setType] = useState<TransactionType | "">("");
  const [categoryId, setCategoryId] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const limit = 10;

  const { data, isLoading, isPlaceholderData } = useTransactions({
    page,
    limit,
    q: q || undefined,
    type: type || undefined,
    categoryId: categoryId || undefined,
  });
  const { data: categories } = useCategories();
  const deleteTransaction = useDeleteTransaction();

  return (
    <>
      <PageHeader
        title="All Transactions"
        description="View, filter, and track all printing orders and expenses."
        action={
          <Button leftIcon={<Plus className="size-4" />} onClick={() => setAddOpen(true)}>
            Add Transaction
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={type}
          onChange={(e) => {
            setType(e.target.value as TransactionType | "");
            setPage(1);
          }}
          placeholder="Type: All"
          className="w-auto"
          options={[
            { value: "", label: "Type: All" },
            { value: "income", label: "Income" },
            { value: "expense", label: "Expense" },
          ]}
        />
        <Select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          placeholder="Category: All"
          className="w-auto"
          options={[
            { value: "", label: "Category: All" },
            ...(categories ?? []).map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
        <div className="ml-auto w-full max-w-[260px]">
          <Input
            placeholder="Search transactions…"
            leftIcon={<Search />}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="bg-card rounded-[var(--radius-md)]">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell className="w-[90px]">Time</TableHeadCell>
              <TableHeadCell className="w-[130px]">Date</TableHeadCell>
              <TableHeadCell>Customer</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell className="w-[110px]">Type</TableHeadCell>
              <TableHeadCell className="w-[120px] text-right">Amount</TableHeadCell>
              <TableHeadCell className="w-[60px]" />
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7}>
                    <SkeletonRow cols={7} />
                  </td>
                </tr>
              ))
            ) : data?.items.length ? (
              data.items.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-ink-muted">{t.time}</TableCell>
                  <TableCell className="text-ink-muted">{formatDate(t.date)}</TableCell>
                  <TableCell className="font-semibold">{t.customerName}</TableCell>
                  <TableCell className="text-ink-muted">{t.categoryName}</TableCell>
                  <TableCell>
                    <Badge tone={t.type === "income" ? "success" : "warning"}>
                      {t.type === "income" ? "Income" : "Expense"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell>
                    <button
                      aria-label="Delete transaction"
                      onClick={() => deleteTransaction.mutate(t.id)}
                      className="text-ink-faint hover:text-danger"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-ink-muted">
                  No transactions match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-body-sm text-ink-muted">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of {data.total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={isPlaceholderData || page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
