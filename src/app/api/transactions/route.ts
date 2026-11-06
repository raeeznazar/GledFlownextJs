import { NextRequest } from "next/server";
import { z } from "zod";
import { created, fail, paginate, paginated, parsePagination, simulateLatency } from "@/lib/api-response";
import { categories, customers, nextId, transactions } from "@/lib/mock-db";
import type { Transaction } from "@/types";

const createSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().min(1, "Customer name is required"),
  categoryId: z.string().min(1, "Category is required"),
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("Amount must be greater than 0"),
  note: z.string().optional(),
  date: z.string().optional(),
});

export async function GET(req: NextRequest) {
  await simulateLatency();

  const { searchParams } = new URL(req.url);
  const { page, limit } = parsePagination(searchParams);
  const q = searchParams.get("q")?.toLowerCase().trim();
  const type = searchParams.get("type");
  const categoryId = searchParams.get("categoryId");
  const sort = searchParams.get("sort") ?? "-createdAt";

  let rows = [...transactions];

  if (q) {
    rows = rows.filter(
      (t) =>
        t.customerName.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q)
    );
  }
  if (type === "income" || type === "expense") {
    rows = rows.filter((t) => t.type === type);
  }
  if (categoryId) {
    rows = rows.filter((t) => t.categoryId === categoryId);
  }

  const [field, dir] = sort.startsWith("-") ? [sort.slice(1), -1] : [sort, 1];
  rows.sort((a, b) => {
    const av = a[field as keyof Transaction];
    const bv = b[field as keyof Transaction];
    if (av === bv) return 0;
    return (av > bv ? 1 : -1) * dir;
  });

  return paginated(paginate(rows, page, limit));
}

export async function POST(req: NextRequest) {
  await simulateLatency();

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  const { customerId, customerName, categoryId, type, amount, note, date } = parsed.data;
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return fail("Category not found", 404);

  const now = date ? new Date(date) : new Date();
  const customer = customerId ? customers.find((c) => c.id === customerId) : undefined;

  const txn: Transaction = {
    id: nextId("txn"),
    date: now.toISOString().slice(0, 10),
    time: now.toTimeString().slice(0, 5),
    customerId: customer?.id ?? null,
    customerName: customer?.name ?? customerName,
    categoryId: category.id,
    categoryName: category.name,
    type,
    amount,
    note,
    createdAt: new Date().toISOString(),
  };

  transactions.unshift(txn);
  category.transactionCount += 1;
  if (customer && type === "income") {
    customer.totalSpent += amount;
    customer.totalOrders += 1;
    customer.lastOrderAt = txn.createdAt;
  }

  return created(txn, "Transaction recorded successfully");
}
