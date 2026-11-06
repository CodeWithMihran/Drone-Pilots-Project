"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [devResetLink, setDevResetLink] = useState("");

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
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to send reset email. Please try again.");
        return;
      }

      if (data?.resetLink) {
        setDevResetLink(data.resetLink);
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

          {devResetLink && (
            <div className="rounded-2xl border border-[#ffbd24]/40 bg-[#ffbd24]/10 p-4 text-xs text-foreground">
              <p className="font-bold text-foreground mb-1">Direct Reset Link (Local Dev):</p>
              <a
                href={devResetLink}
                className="font-medium text-[#fabf28] hover:underline break-all"
              >
                {devResetLink}
              </a>
            </div>
          )}

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
