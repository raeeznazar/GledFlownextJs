import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, notFound, ok, simulateLatency } from "@/lib/api-response";
import { staff } from "@/lib/mock-db";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["admin", "staff", "ceo"]).optional(),
  status: z.enum(["active", "suspended"]).optional(),
  permissions: z
    .array(z.object({ key: z.string(), label: z.string(), allowed: z.boolean() }))
    .optional(),
});

type Params = Promise<{ id: string }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  await simulateLatency();
  const { id } = await params;
  const member = staff.find((s) => s.id === id);
  if (!member) return notFound("Staff member not found");
  return ok(member);
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  await simulateLatency();
  const { id } = await params;
  const member = staff.find((s) => s.id === id);
  if (!member) return notFound("Staff member not found");

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  Object.assign(member, parsed.data);
  return ok(member, "Staff member updated successfully");
}

export async function DELETE(_req: NextRequest, { params }: { params: Params }) {
  await simulateLatency();
  const { id } = await params;
  const idx = staff.findIndex((s) => s.id === id);
  if (idx === -1) return notFound("Staff member not found");
  const [removed] = staff.splice(idx, 1);
  return ok(removed, "Staff member removed successfully");
}
