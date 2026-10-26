"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: redirectUrl,
        }
      );

      if (resetError) {
        setError(resetError.message || "Failed to send reset email. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email associated with your account to receive password recovery instructions."
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
      {submitted ? (
        <div className="space-y-4">
          <Alert variant="success">
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Check your email</p>
              <p className="text-xs text-muted-foreground">
                If an account exists for <strong className="text-foreground">{email}</strong>,
                we have sent instructions to reset your password. Please check your inbox and follow the link.
              </p>
            </div>
          </Alert>

          <Button asChild block variant="secondary">
            <Link href="/login">Return to sign in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error && (
            <Alert tone="error">{error}</Alert>
          )}

          <Field label="Account Email" htmlFor="reset-email">
            <Input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@company.com"
              autoComplete="email"
              disabled={loading}
            />
          </Field>

          <Button
            id="reset-submit-btn"
            type="submit"
            block
            variant="primary"
            disabled={loading}
          >
            {loading ? "Sending link…" : "Send Reset Instructions"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
