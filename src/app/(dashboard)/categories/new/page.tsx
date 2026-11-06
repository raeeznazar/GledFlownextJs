"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateCategory } from "@/hooks/use-categories";
import type { TransactionType } from "@/types";

const SWATCHES = [
  "#2554e0",
  "#0e7490",
  "#15803d",
  "#b45309",
  "#ef4444",
  "#f97316",
  "#a855f7",
  "#64748b",
  "#0ea5e9",
];

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("income");
  const [color, setColor] = useState(SWATCHES[0]);
  const [error, setError] = useState("");
  const createCategory = useCreateCategory();

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Category name is required");
      return;
    }
    createCategory.mutate(
      { name: name.trim(), type, color },
      { onSuccess: () => router.push("/categories") }
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/categories")}
          aria-label="Back to categories"
          className="flex items-center justify-center rounded-[var(--radius-sm)] border border-border bg-card p-2 text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" />
        </button>
        <h1 className="text-h2 font-bold text-ink">New Category</h1>
      </div>

      <div className="flex w-full max-w-[640px] flex-col gap-6 rounded-[var(--radius-md)] border border-border bg-card p-8">
        <div className="flex flex-col gap-2">
          <label className="text-body-sm font-semibold text-ink" htmlFor="category-name">
            Category name
          </label>
          <Input
            id="category-name"
            placeholder="e.g. Stationery"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            error={error}
          />
          <p className="text-caption text-ink-muted">
            This is the category staff will pick from when recording a transaction.
          </p>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="flex flex-col gap-3">
          <p className="text-body-sm font-semibold text-ink">Type</p>
          <div className="flex gap-2">
            {(["income", "expense"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-[var(--radius-sm)] border px-4 py-2.5 text-body-sm font-semibold transition-colors ${
                  type === t
                    ? "border-brand bg-brand-subtle text-brand"
                    : "border-border bg-input text-ink-muted hover:text-ink"
                }`}
              >
                {t === "income" ? "Income" : "Expense"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-body-sm font-semibold text-ink">Color</p>
          <div className="flex flex-wrap gap-2">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                aria-label={`Select color ${swatch}`}
                onClick={() => setColor(swatch)}
                className="flex size-8 items-center justify-center rounded-full"
                style={{
                  backgroundColor: swatch,
                  outline: color === swatch ? "2px solid var(--color-ink)" : "none",
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-border" />

        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => router.push("/categories")}>
            Cancel
          </Button>
          <Button loading={createCategory.isPending} onClick={handleSubmit}>
            Create Category
          </Button>
        </div>
      </div>
    </div>
  );
}
