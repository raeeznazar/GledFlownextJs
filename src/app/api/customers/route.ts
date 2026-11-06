import { NextRequest } from "next/server";
import { z } from "zod";
import { created, fail, paginate, paginated, parsePagination, simulateLatency } from "@/lib/api-response";
import { customers, nextId } from "@/lib/mock-db";
import type { Customer } from "@/types";

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  company: z.string().optional(),
  address: z.string().optional(),
});

export async function GET(req: NextRequest) {
  await simulateLatency();
  const { searchParams } = new URL(req.url);
  const { page, limit } = parsePagination(searchParams);
  const q = searchParams.get("q")?.toLowerCase().trim();
  const status = searchParams.get("status");

  let rows = [...customers];
  if (q) {
    rows = rows.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }
  if (status === "active" || status === "inactive") {
    rows = rows.filter((c) => c.status === status);
  }
  rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return paginated(paginate(rows, page, limit));
}

export async function POST(req: NextRequest) {
  await simulateLatency();
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  const customer: Customer = {
    id: nextId("cus"),
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || undefined,
    company: parsed.data.company,
    address: parsed.data.address,
    totalSpent: 0,
    totalOrders: 0,
    lastOrderAt: null,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  customers.unshift(customer);
  return created(customer, "Customer added successfully");
}
