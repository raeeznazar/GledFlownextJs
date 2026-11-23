"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/utils";
import { useCreateCategory } from "@/hooks/use-categories";
import type { TransactionType } from "@/types";

const SWATCHES = [
  { name: "Blue", value: "var(--brand)" },
  { name: "Teal", value: "var(--info)" },
  { name: "Green", value: "#15803d" },
  { name: "Amber", value: "var(--warning)" },
  { name: "Red", value: "var(--danger)" },
  { name: "Orange", value: "#f97316" },
  { name: "Purple", value: "#a855f7" },
  { name: "Slate", value: "#64748b" },
  { name: "Sky", value: "#0ea5e9" },
];

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("income");
  const [color, setColor] = useState(SWATCHES[0].value);
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
          className="flex items-center justify-center rounded-[var(--radius-full)] border border-border bg-card p-2 text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" />
        </button>
        <h1 className="text-h2 text-ink">New Category</h1>
      </div>

      <div className="flex w-full max-w-[640px] flex-col gap-6 rounded-[var(--radius-md)] border border-border bg-card p-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="category-name">Category name</Label>
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
          <Label>Type</Label>
          <SegmentedControl
            fullWidth
            value={type}
            onChange={setType}
            options={[
              { value: "income", label: "Income" },
              { value: "expense", label: "Expense" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch.name}
                type="button"
                aria-label={`Select color ${swatch.name}`}
                aria-pressed={color === swatch.value}
                onClick={() => setColor(swatch.value)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-card transition-shadow",
                  color === swatch.value && "ring-2 ring-ink"
                )}
                style={{ backgroundColor: swatch.value }}
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
