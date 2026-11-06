import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, ok, simulateLatency } from "@/lib/api-response";
import { staff } from "@/lib/mock-db";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  await simulateLatency();

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  const { email, password } = parsed.data;
  const user = staff.find((s) => s.email.toLowerCase() === email.toLowerCase());

  // Mock auth: any password with 6+ chars succeeds for a seeded email,
  // otherwise invalid credentials. Clearly not real backend auth.
  if (!user || password.length < 6) {
    return fail("Invalid email or password", 401);
  }

  return ok(
    {
      token: `mock_${Buffer.from(user.id).toString("base64")}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    "Logged in successfully"
  );
}
