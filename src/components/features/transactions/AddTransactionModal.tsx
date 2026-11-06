"use client";

import { useMemo, useState } from "react";
import { Plus, Minus, Undo2, Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn, formatCurrency } from "@/lib/utils";
import { useCategories } from "@/hooks/use-categories";
import { useCustomers } from "@/hooks/use-customers";
import { useCreateTransaction } from "@/hooks/use-transactions";
import type { TransactionType } from "@/types";

type EntryKind = "income" | "expense" | "refund";

const kindConfig: Record<EntryKind, { label: string; sub: string; icon: typeof Plus }> = {
  income: { label: "Income", sub: "Inflow", icon: Plus },
  expense: { label: "Expense", sub: "Outflow", icon: Minus },
  refund: { label: "Refund", sub: "Adjustment", icon: Undo2 },
};

export function AddTransactionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [kind, setKind] = useState<EntryKind>("income");
  const effectiveType: TransactionType = kind === "income" ? "income" : "expense";

  const { data: categories } = useCategories(effectiveType);
  const { data: customersPage } = useCustomers({ limit: 100 });

  const [categoryId, setCategoryId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [remarks, setRemarks] = useState("");
  const [printBill, setPrintBill] = useState(true);

  const total = useMemo(() => Math.max(0, quantity) * Math.max(0, unitPrice), [quantity, unitPrice]);

  const createTransaction = useCreateTransaction();

  const reset = () => {
    setKind("income");
    setCategoryId("");
    setCustomerId("");
    setCustomerName("");
    setQuantity(1);
    setUnitPrice(0);
    setPaymentMethod("cash");
    setRemarks("");
    setPrintBill(true);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const category = categories?.find((c) => c.id === categoryId) ?? categories?.[0];
    if (!category) return;
    const resolvedCustomer = customersPage?.items.find((c) => c.id === customerId);

    createTransaction.mutate(
      {
        customerId: resolvedCustomer?.id,
        customerName: resolvedCustomer?.name ?? (customerName || "Walk-in customer"),
        categoryId: category.id,
        type: effectiveType,
        amount: total || 1,
        date,
        note: [
          kind === "refund" ? "Refund" : undefined,
          `Qty ${quantity} × ${formatCurrency(unitPrice)}`,
          `Paid via ${paymentMethod}`,
          printBill ? "Bill printed" : undefined,
          remarks || undefined,
        ]
          .filter(Boolean)
          .join(" · "),
      },
      { onSuccess: handleClose }
    );
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Add Transaction"
      footer={
        <>
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            loading={createTransaction.isPending}
            onClick={handleSubmit}
            disabled={!categories?.length}
          >
            Create Transaction
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-semibold text-ink">What would you like to record?</p>
          <div className="flex gap-2">
            {(Object.keys(kindConfig) as EntryKind[]).map((k) => {
              const cfg = kindConfig[k];
              const Icon = cfg.icon;
              const active = kind === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={cn(
                    "flex h-[52px] flex-1 items-center gap-2 rounded-[var(--radius-sm)] border p-3 text-left transition-colors",
                    active ? "border-2 border-brand bg-brand-subtle" : "border-border bg-surface-0 hover:bg-surface-100"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-xl",
                      active ? "bg-brand text-brand-ink" : "bg-surface-100 text-ink-muted"
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[13px] font-semibold text-ink">{cfg.label}</span>
                    <span className="text-[10px] text-ink-muted">{cfg.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] font-semibold text-ink">Category</p>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Select category"
              options={(categories ?? []).map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] font-semibold text-ink">Payment Method</p>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={[
                { value: "cash", label: "Cash" },
                { value: "upi", label: "UPI" },
                { value: "card", label: "Card" },
                { value: "bank", label: "Bank Transfer" },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-semibold text-ink">Customer</p>
          <Select
            value={customerId}
            onChange={(e) => {
              setCustomerId(e.target.value);
              setCustomerName("");
            }}
            placeholder="Search or select customer"
            options={(customersPage?.items ?? []).map((c) => ({ value: c.id, label: c.name }))}
          />
          <Input
            placeholder="…or type a new customer name"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              setCustomerId("");
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] font-semibold text-ink">Quantity</p>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] font-semibold text-ink">Unit Price</p>
            <Input
              type="number"
              min={0}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-warning-bg px-4 py-3">
          <p className="text-[13px] font-medium text-warning">Total (auto-calculated)</p>
          <p className="text-[18px] font-extrabold text-ink">{formatCurrency(total)}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-semibold text-ink">Date</p>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-[13px] font-semibold text-ink">Remarks (optional)</p>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            placeholder="Add a note about this transaction"
            className="w-full resize-none rounded-[var(--radius-sm)] border border-border bg-input p-3 text-[13px] text-ink outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
          />
        </div>

        <Checkbox
          label={
            <span className="inline-flex items-center gap-1.5">
              <Printer className="size-3.5" /> Print Bill
            </span>
          }
          checked={printBill}
          onChange={(e) => setPrintBill(e.target.checked)}
        />
      </div>
    </Drawer>
  );
}
