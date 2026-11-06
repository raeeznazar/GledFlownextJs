import { NextRequest } from "next/server";
import { notFound, ok, simulateLatency } from "@/lib/api-response";
import { categories } from "@/lib/mock-db";

type Params = Promise<{ id: string }>;

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  await simulateLatency();
  const { id } = await params;
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return notFound("Category not found");
  const [removed] = categories.splice(idx, 1);
  return ok(removed, "Category deleted successfully");
}
