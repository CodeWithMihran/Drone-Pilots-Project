"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        // 1. Check for error in hash (e.g. expired or invalid OTP from Supabase)
        if (typeof window !== "undefined" && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const hashError =
            hashParams.get("error_description") || hashParams.get("error");
          if (hashError) {
            if (isMounted) {
              setError(decodeURIComponent(hashError.replace(/\+/g, " ")));
              setHasValidSession(false);
              setCheckingSession(false);
            }
            return;
          }
        }

        // 2. Check for PKCE code in query params (?code=...)
        const code = searchParams.get("code");
        if (code) {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            if (isMounted) {
              setError(exchangeError.message);
              setHasValidSession(false);
              setCheckingSession(false);
            }
            return;
          }
          if (data?.session) {
            if (isMounted) {
              setUserEmail(data.session.user.email ?? null);
              setHasValidSession(true);
              setCheckingSession(false);
            }
            return;
          }
        }

        // 3. Check active session (established from hash fragment or storage by Supabase)
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          if (isMounted) {
            setUserEmail(session.user.email ?? null);
            setHasValidSession(true);
            setCheckingSession(false);
          }
          return;
        }

        // 4. Check if URL hash has recovery token parameters
        if (typeof window !== "undefined" && window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          if (
            hashParams.get("type") === "recovery" ||
            hashParams.get("access_token")
          ) {
            if (isMounted) {
              setHasValidSession(true);
              setCheckingSession(false);
            }
            return;
          }
        }

        // 5. Fallback: check query token if any
        const token = searchParams.get("token");
        if (token) {
          if (isMounted) {
            setHasValidSession(true);
            setCheckingSession(false);
          }
          return;
        }

        // No recovery session detected
        if (isMounted) {
          setHasValidSession(false);
          setCheckingSession(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to verify reset link.");
          setHasValidSession(false);
          setCheckingSession(false);
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        if (isMounted) {
          setHasValidSession(true);
          setUserEmail(session?.user?.email ?? null);
          setCheckingSession(false);
        }
      }
    });

    initSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1. Securely set new password in Supabase Auth using updateUser()
      const { data, error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message || "Failed to update password. Please try again.");
        return;
      }

      // 2. Synchronize new password with MongoDB if user exists
      const emailToSync = data?.user?.email || userEmail;
      if (emailToSync) {
        try {
          await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: emailToSync, password }),
          });
        } catch (syncErr) {
          console.warn("MongoDB password sync notice:", syncErr);
        }
      }

      setSuccess(true);
      // Redirect to login after 2.5 seconds
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setError(err.message || "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Verifying password reset link…
      </div>
    );
  }

  if (!hasValidSession) {
    return (
      <div className="space-y-4">
        <Alert tone="error">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Invalid or expired reset link</p>
            <p className="text-xs text-muted-foreground">
              {error ||
                "This password reset link is invalid or has expired. Please request a new one."}
            </p>
          </div>
        </Alert>
        <Button asChild block variant="secondary">
          <Link href="/forgot-password">Request new link</Link>
        </Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4">
        <Alert variant="success">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">Password updated successfully</p>
            <p className="text-xs text-muted-foreground">
              Your password has been reset. Redirecting you to sign in…
            </p>
          </div>
        </Alert>
        <Button asChild block variant="secondary">
          <Link href="/login">Sign in now</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && <Alert tone="error">{error}</Alert>}

      <Field label="New Password" htmlFor="new-password">
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          disabled={loading}
        />
      </Field>

      <Field label="Confirm New Password" htmlFor="confirm-password">
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat your new password"
          disabled={loading}
        />
      </Field>

      <Button
        id="reset-password-submit-btn"
        type="submit"
        block
        variant="primary"
        disabled={loading}
      >
        {loading ? "Updating password…" : "Set new password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set new password"
      subtitle="Choose a strong new password for your Certified Drone Pilots account."
      footer={
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      }
    >
      <Suspense fallback={<p className="text-body text-muted-foreground">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
