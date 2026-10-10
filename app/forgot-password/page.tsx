"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
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
              <p className="font-semibold text-foreground">Password reset request recorded</p>
              <p className="text-xs text-muted-foreground">
                If an account exists for <strong className="text-foreground">{email}</strong>, recovery instructions will be dispatched.
              </p>
            </div>
          </Alert>

          <Button asChild block variant="secondary">
            <Link href="/login">Return to sign in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Account Email" htmlFor="reset-email">
            <Input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@company.com"
              autoComplete="email"
            />
          </Field>

          <Button type="submit" block variant="primary">
            Send Reset Instructions
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
