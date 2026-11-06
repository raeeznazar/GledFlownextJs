import { NextRequest } from "next/server";
import { z } from "zod";
import { created, fail, ok, simulateLatency } from "@/lib/api-response";
import { nextId, staff } from "@/lib/mock-db";
import type { Permission, StaffMember } from "@/types";

const permissionDefs: Omit<Permission, "allowed">[] = [
  { key: "transactions.view", label: "View transactions" },
  { key: "transactions.manage", label: "Add / edit transactions" },
  { key: "customers.manage", label: "Manage customers" },
  { key: "categories.manage", label: "Manage categories" },
  { key: "staff.manage", label: "Manage staff & access" },
  { key: "analytics.view", label: "View analytics & reports" },
  { key: "settings.manage", label: "Manage business settings" },
];

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  role: z.enum(["admin", "staff", "ceo"]),
});

export async function GET() {
  await simulateLatency();
  return ok(staff);
}

export async function POST(req: NextRequest) {
  await simulateLatency();
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  if (staff.some((s) => s.email.toLowerCase() === parsed.data.email.toLowerCase())) {
    return fail("A staff member with this email already exists", 409);
  }

  const member: StaffMember = {
    id: nextId("stf"),
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    role: parsed.data.role,
    status: "active",
    permissions: permissionDefs.map((p) => ({
      ...p,
      allowed: parsed.data.role !== "staff",
    })),
    createdAt: new Date().toISOString(),
  };
  staff.unshift(member);
  return created(member, "Staff member invited successfully");
}
