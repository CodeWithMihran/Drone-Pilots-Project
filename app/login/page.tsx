"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextErrors.email = "Enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email.";
    if (!password) nextErrors.password = "Enter your password.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role;

        if (callbackUrl && !callbackUrl.includes("/login")) {
          router.push(callbackUrl);
        } else if (role === "PILOT") {
          router.push("/pilot/dashboard");
        } else if (role === "COMPANY") {
          router.push("/company/dashboard");
        } else if (role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFieldErrors({});
    setError("");
  };

  return (
    <>
      {error && (
        <div className="mb-5">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field label="Email" htmlFor="login-email-input" error={fieldErrors.email}>
          <Input
            id="login-email-input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            error={fieldErrors.email}
          />
        </Field>

        <Field label="Password" htmlFor="login-password-input" error={fieldErrors.password}>
          <PasswordInput
            id="login-password-input"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            error={fieldErrors.password}
          />
        </Field>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-caption font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button id="login-submit-btn" type="submit" block size="lg" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 border-t border-border pt-5">
        <button
          type="button"
          onClick={() => setShowDemo((v) => !v)}
          className="text-caption text-subtle hover:text-muted-foreground"
        >
          {showDemo ? "Hide demo accounts" : "Use a demo account"}
        </button>

        {showDemo && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: "Pilot", email: "pilot@example.com", pass: "pilot123" },
              { label: "Company", email: "company@example.com", pass: "company123" },
              { label: "Admin", email: "admin@example.com", pass: "admin123" },
            ].map((demo) => (
              <button
                key={demo.label}
                type="button"
                onClick={() => fillDemo(demo.email, demo.pass)}
                className="rounded-control border border-border px-2 py-2.5 text-caption font-medium text-foreground hover:border-border-strong hover:bg-surface-2"
              >
                {demo.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Use the email and password for your Certified Drone Pilots account."
      footer={
        <>
          Don’t have an account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense fallback={<p className="text-body text-muted-foreground">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}