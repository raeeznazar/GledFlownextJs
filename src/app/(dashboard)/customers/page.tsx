"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "@/components/ui/Table";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { AddCustomerModal } from "@/components/features/customers/AddCustomerModal";
import { useCustomers } from "@/hooks/use-customers";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const limit = 10;

  const { data, isLoading, isPlaceholderData } = useCustomers({
    page,
    limit,
    q: q || undefined,
  });

  return (
    <>
      <PageHeader
        title="Customers"
        description="Manage customer relationships, track order frequency and outstanding balances."
        action={
          <Button leftIcon={<Plus className="size-4" />} onClick={() => setAddOpen(true)}>
            Add Customer
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-[280px]">
          <Input
            placeholder="Search customers…"
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
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Contact</TableHeadCell>
              <TableHeadCell className="w-[140px] text-right">Total Purchases</TableHeadCell>
              <TableHeadCell className="w-[120px] text-right">Transactions</TableHeadCell>
              <TableHeadCell className="w-[130px]">Last Purchase</TableHeadCell>
              <TableHeadCell className="w-[110px] text-right">Outstanding</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6}>
                    <SkeletonRow cols={6} />
                  </td>
                </tr>
              ))
            ) : data?.items.length ? (
              data.items.map((c) => (
                <TableRow
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/customers/${c.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} />
                      <span className="font-semibold">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-ink-muted">{c.phone}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(c.totalSpent)}
                  </TableCell>
                  <TableCell className="text-right text-ink-muted">{c.totalOrders}</TableCell>
                  <TableCell className="text-ink-muted">
                    {c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}
                  </TableCell>
                  <TableCell className="text-right text-ink-muted">—</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-ink-muted">
                  No customers match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-body-sm text-ink-muted">
        Click a row to open the customer&apos;s full profile and transaction history.
      </p>

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

      <AddCustomerModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
