import { NextRequest } from "next/server";
import { z } from "zod";
import { created, fail, ok, simulateLatency } from "@/lib/api-response";
import { categories, nextId } from "@/lib/mock-db";
import type { Category } from "@/types";

const createSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["income", "expense"]),
  color: z.string().optional(),
});

export async function GET(req: NextRequest) {
  await simulateLatency();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  let rows = [...categories];
  if (type === "income" || type === "expense") {
    rows = rows.filter((c) => c.type === type);
  }
  return ok(rows);
}

export async function POST(req: NextRequest) {
  await simulateLatency();
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  if (categories.some((c) => c.name.toLowerCase() === parsed.data.name.toLowerCase())) {
    return fail("A category with this name already exists", 409);
  }

  const category: Category = {
    id: nextId("cat"),
    name: parsed.data.name,
    type: parsed.data.type,
    color: parsed.data.color ?? "#2554e0",
    transactionCount: 0,
    createdAt: new Date().toISOString(),
  };
  categories.unshift(category);
  return created(category, "Category created successfully");
}
