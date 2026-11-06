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
import { Logo } from "@/components/layout/Logo";
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
      <div className="relative hidden flex-1 flex-col items-center justify-center gap-10 overflow-hidden bg-[#071126] p-10 lg:flex xl:p-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 size-[400px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(37,84,224,0.55) 0%, rgba(37,84,224,0) 70%)",
          }}
        />
        <div className="relative z-10 flex w-[380px] flex-col items-center gap-6 rounded-2xl bg-white p-8 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
          <svg
            width="88"
            height="88"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="shrink-0"
          >
            <rect width="36" height="36" rx="10" fill="var(--brand)" />
            <path
              d="M18 9.5C13.86 9.5 10.5 12.86 10.5 17s3.36 7.5 7.5 7.5c3.42 0 6.3-2.3 7.2-5.43H18v-2.7h9.17c.1.59.16 1.2.16 1.83 0 5.6-3.98 9.8-9.33 9.8-5.6 0-10.13-4.53-10.13-10.1S12.4 7.3 18 7.3c2.76 0 5.08 1.01 6.86 2.67l-2 2A6.62 6.62 0 0 0 18 9.5Z"
              fill="white"
            />
          </svg>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-bold text-[#071126]">Gled Flow</span>
              <span className="rounded-[4px] bg-[#e1e6ff] px-2 py-0.5 text-[11px] font-semibold text-brand">
                v1
              </span>
            </div>
            <p className="text-[14px] text-ink-muted">
              Intelligent business operations, unified in flow.
            </p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-[13px] font-medium uppercase tracking-wide text-white/50">
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
            <p className="text-[16px] text-ink-muted">Sign in to Gled Flow</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-ink" htmlFor="email">
                Email or username
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email or username"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-ink" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="pointer-events-auto flex items-center gap-1 text-[12px] font-medium text-ink-muted hover:text-ink"
                    tabIndex={-1}
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
            <button type="button" className="text-[14px] font-medium text-brand hover:underline">
              Forgot password?
            </button>
          </div>

          <Button type="submit" size="lg" loading={submitting} className="w-full rounded-[10px]">
            Login
          </Button>

          <p className="text-center text-[14px] text-ink-muted">
            {"Don't have an account? "}
            <span className="font-semibold text-brand">Contact your admin</span>
          </p>

          <p className="text-center text-[12px] text-ink-faint">
            Demo: any seeded email (e.g. raeez@gledflow.app) + any 6+ character password.
          </p>
        </form>
      </div>
    </div>
  );
}
