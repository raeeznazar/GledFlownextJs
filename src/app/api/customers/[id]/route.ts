import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, notFound, ok, simulateLatency } from "@/lib/api-response";
import { customers, transactions } from "@/lib/mock-db";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(7).optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  await simulateLatency();
  const { id } = await params;
  const customer = customers.find((c) => c.id === id);
  if (!customer) return notFound("Customer not found");

  const orders = transactions
    .filter((t) => t.customerId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return ok({ ...customer, orders });
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  await simulateLatency();
  const { id } = await params;
  const customer = customers.find((c) => c.id === id);
  if (!customer) return notFound("Customer not found");

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  Object.assign(customer, parsed.data);
  return ok(customer, "Customer updated successfully");
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  await simulateLatency();
  const { id } = await params;
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return notFound("Customer not found");
  const [removed] = customers.splice(idx, 1);
  return ok(removed, "Customer deleted successfully");
}
