"use client";

import React, { useState, useEffect, Suspense } from "react";
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
  const [isReadOnly, setIsReadOnly] = useState(true);

  // Clear any cached credentials on mount so fields always start empty
  useEffect(() => {
    setEmail("");
    setPassword("");
    const timer = setTimeout(() => {
      setIsReadOnly(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleUserInteraction = () => {
    if (isReadOnly) {
      setIsReadOnly(false);
    }
  };

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
      const cleanCallback = callbackUrl && !callbackUrl.includes("/login") ? callbackUrl : "";

      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl: cleanCallback || "/",
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin" || res.error === "Invalid email or password") {
          setError("Invalid email or password. Please verify your credentials.");
        } else if (res.error === "Configuration") {
          setError("Invalid credentials or authentication error. Please try again.");
        } else {
          setError(res.error);
        }
        setLoading(false);
      } else {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role;

        if (cleanCallback) {
          router.push(cleanCallback);
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

  return (
    <>
      {error && (
        <div className="mb-5">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        noValidate
        autoComplete="off"
        onMouseEnter={handleUserInteraction}
        onPointerDown={handleUserInteraction}
        onTouchStart={handleUserInteraction}
      >
        {/* Decoy fields to capture automatic browser password manager autofill */}
        <div
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            width: "1px",
            height: "1px",
            opacity: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
          aria-hidden="true"
          tabIndex={-1}
        >
          <input type="text" name="fake_username_prevent_autofill" tabIndex={-1} autoComplete="off" />
          <input type="password" name="fake_password_prevent_autofill" tabIndex={-1} autoComplete="off" />
        </div>

        <Field label="Email" htmlFor="user-account-identifier" error={fieldErrors.email}>
          <Input
            id="user-account-identifier"
            name="aerolink_user_email"
            type="email"
            readOnly={isReadOnly}
            onFocus={handleUserInteraction}
            onPointerDown={handleUserInteraction}
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            error={fieldErrors.email}
          />
        </Field>

        <Field label="Password" htmlFor="user-account-credential" error={fieldErrors.password}>
          <PasswordInput
            id="user-account-credential"
            name="aerolink_user_secret"
            readOnly={isReadOnly}
            onFocus={handleUserInteraction}
            onPointerDown={handleUserInteraction}
            autoComplete="new-password"
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

        <Button id="login-submit-btn" type="submit" block size="lg" disabled={loading} className="rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold shadow-xs transition-all active:scale-[0.98]">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
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
