import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, notFound, ok, simulateLatency } from "@/lib/api-response";
import { transactions } from "@/lib/mock-db";

const updateSchema = z.object({
  customerName: z.string().min(1).optional(),
  categoryName: z.string().min(1).optional(),
  type: z.enum(["income", "expense"]).optional(),
  amount: z.number().positive().optional(),
  note: z.string().optional(),
});

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  await simulateLatency();
  const { id } = await params;
  const txn = transactions.find((t) => t.id === id);
  if (!txn) return notFound("Transaction not found");
  return ok(txn);
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  await simulateLatency();
  const { id } = await params;
  const txn = transactions.find((t) => t.id === id);
  if (!txn) return notFound("Transaction not found");

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  Object.assign(txn, parsed.data);
  return ok(txn, "Transaction updated successfully");
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  await simulateLatency();
  const { id } = await params;
  const idx = transactions.findIndex((t) => t.id === id);
  if (idx === -1) return notFound("Transaction not found");
  const [removed] = transactions.splice(idx, 1);
  return ok(removed, "Transaction deleted successfully");
}
