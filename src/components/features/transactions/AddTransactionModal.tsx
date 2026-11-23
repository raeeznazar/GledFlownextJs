"use client";

import { useMemo, useState } from "react";
import { Plus, Minus, Undo2, Printer } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { formatCurrency } from "@/lib/utils";
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
          <Label>What would you like to record?</Label>
          <SegmentedControl
            fullWidth
            value={kind}
            onChange={setKind}
            options={(Object.keys(kindConfig) as EntryKind[]).map((k) => {
              const cfg = kindConfig[k];
              const Icon = cfg.icon;
              return { value: k, label: cfg.label, sublabel: cfg.sub, icon: <Icon className="size-3.5" /> };
            })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="txn-category">Category</Label>
            <Select
              id="txn-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="Select category"
              options={(categories ?? []).map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="txn-payment-method">Payment Method</Label>
            <Select
              id="txn-payment-method"
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
          <Label htmlFor="txn-customer">Customer</Label>
          <Select
            id="txn-customer"
            value={customerId}
            onChange={(e) => {
              setCustomerId(e.target.value);
              setCustomerName("");
            }}
            placeholder="Search or select customer"
            options={(customersPage?.items ?? []).map((c) => ({ value: c.id, label: c.name }))}
          />
          <Input
            aria-label="Or type a new customer name"
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
            <Label htmlFor="txn-quantity">Quantity</Label>
            <Input
              id="txn-quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="txn-unit-price">Unit Price</Label>
            <Input
              id="txn-unit-price"
              type="number"
              min={0}
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-brand-subtle px-4 py-3">
          <p className="text-body-sm font-medium text-brand">Total (auto-calculated)</p>
          <p className="text-h3 text-ink">{formatCurrency(total)}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="txn-date">Date</Label>
          <Input id="txn-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="txn-remarks">
            Remarks <span className="text-ink-faint">(optional)</span>
          </Label>
          <textarea
            id="txn-remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            placeholder="Add a note about this transaction"
            className="w-full resize-none rounded-[var(--radius-sm)] border border-border bg-input p-3 text-body-sm text-ink outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
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
