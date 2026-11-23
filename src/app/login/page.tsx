"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Label } from "@/components/ui/Label";
import { Logo } from "@/components/layout/Logo";
import { BrandMark } from "@/components/layout/BrandMark";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/services/api/axios";
import { endpoints } from "@/services/api/endpoints";
import type { ApiResponse } from "@/types";

const loginSchema = z.object({
  email: z.string().min(1, "Email or username is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
  user: { id: string; name: string; email: string; role: "admin" | "staff" | "ceo" };
}

export default function LoginPage() {
  const router = useRouter();
  const { show } = useToast();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "raeez@gledflow.app", password: "", remember: true },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitting(true);
    try {
      const { data } = await api.post<ApiResponse<LoginResponse>>(endpoints.login, {
        email: values.email,
        password: values.password,
      });
      login(data.data.user);
      show({ tone: "success", title: `Welcome back, ${data.data.user.name.split(" ")[0]}` });
      router.push("/dashboard");
    } catch (error) {
      show({
        tone: "danger",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-surface-0">
      {/* Branded left panel */}
      <div className="relative hidden flex-1 flex-col items-center justify-center gap-10 overflow-hidden bg-brand-ink-panel p-10 lg:flex xl:p-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 size-[400px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(37,84,224,0.55) 0%, rgba(37,84,224,0) 70%)",
          }}
        />
        <div className="relative z-10 flex w-[380px] flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
          <BrandMark size={88} className="shrink-0" />
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <span className="text-h3 text-brand-ink-panel">Gled Flow</span>
              <Badge tone="brand">v1</Badge>
            </div>
            <p className="text-body text-ink-muted">
              Intelligent business operations, unified in flow.
            </p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-body-sm font-medium uppercase tracking-wide text-white/50">
          <ShieldCheck className="size-4" />
          Enterprise security guaranteed
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-1 flex-col items-center justify-center p-8 sm:p-12 lg:w-[640px] lg:flex-none">
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-[400px] flex-col gap-8">
          <div className="flex flex-col gap-2 lg:hidden">
            <Logo />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-display text-ink">Welcome back</h1>
            <p className="text-body text-ink-muted">Sign in to Gled Flow</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email or username</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email or username"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="pointer-events-auto flex items-center gap-1 rounded-[var(--radius-sm)] text-caption font-medium text-ink-muted hover:text-ink"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
                {...register("password")}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Checkbox label="Remember me" {...register("remember")} />
            <button type="button" className="text-body-sm font-medium text-brand hover:underline">
              Forgot password?
            </button>
          </div>

          <Button type="submit" size="lg" loading={submitting} className="w-full">
            Login
          </Button>

          <p className="text-center text-body-sm text-ink-muted">
            {"Don't have an account? "}
            <span className="font-semibold text-brand">Contact your admin</span>
          </p>

          <p className="text-center text-caption text-ink-faint">
            Demo: any seeded email (e.g. raeez@gledflow.app) + any 6+ character password.
          </p>
        </form>
      </div>
    </div>
  );
}
