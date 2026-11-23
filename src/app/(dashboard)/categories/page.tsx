"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "@/components/ui/Table";
import { SkeletonRow } from "@/components/ui/Skeleton";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { formatDate } from "@/lib/utils";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const router = useRouter();
  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organize the products and services staff pick from when recording a transaction."
        action={
          <Button
            leftIcon={<Plus className="size-4" />}
            onClick={() => router.push("/categories/new")}
          >
            Category
          </Button>
        }
      />

      <div className="bg-card rounded-[var(--radius-md)]">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell className="w-[140px]">Type</TableHeadCell>
              <TableHeadCell className="w-[140px]">Transactions</TableHeadCell>
              <TableHeadCell className="w-[160px]">Created</TableHeadCell>
              <TableHeadCell className="w-[80px] text-right">Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5}>
                    <SkeletonRow cols={5} />
                  </td>
                </tr>
              ))
            ) : categories?.length ? (
              categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: c.color }}
                        aria-hidden
                      />
                      <span className="font-semibold">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge tone={c.type === "income" ? "success" : "warning"}>
                      {c.type === "income" ? "Income" : "Expense"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-ink-muted">{c.transactionCount}</TableCell>
                  <TableCell className="text-ink-muted">{formatDate(c.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <button
                        aria-label={`Delete ${c.name}`}
                        onClick={() => setPendingDelete(c)}
                        className="rounded-[var(--radius-sm)] text-ink-faint transition-colors hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-ink-muted">
                  No categories yet. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-body-sm text-ink-muted">
        Categories group the income and expense types staff choose from when recording a
        transaction.
      </p>

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This can't be undone. Transactions already recorded under this category keep their history."
        loading={deleteCategory.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteCategory.mutate(pendingDelete.id, { onSuccess: () => setPendingDelete(null) });
        }}
      />
    </>
  );
}
