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
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "COMPANY" ? "COMPANY" : "PILOT";

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"PILOT" | "COMPANY">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("Commercial Services");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const goToDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email.";
    if (password.length < 6) next.password = "Use at least 6 characters.";
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const next: Record<string, string> = {};
    if (!city.trim()) next.city = "Enter your city.";
    if (!state.trim()) next.state = "Enter your state.";
    if (role === "COMPANY" && companyName.trim().length < 2) {
      next.companyName = "Enter the company name.";
    }
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
          city,
          state,
          country: "United States",
          companyName: role === "COMPANY" ? companyName : undefined,
          industry: role === "COMPANY" ? industry : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/login?registered=true");
      } else {
        if (role === "PILOT") {
          router.push("/pilot/dashboard");
        } else {
          router.push("/company/dashboard");
        }
        router.refresh();
      }
    } catch (err: any) {
      const msg = err.message || "Something went wrong.";
      // Automatically bounce user back to Step 1 if the error is about the email
      if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("exists")) {
        setStep(1);
        setFieldErrors({ email: msg });
      } else {
        setError(msg);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-3 text-caption">
        <span className={cn("font-medium", step === 1 ? "text-foreground" : "text-subtle")}>
          1. Account
        </span>
        <span className="h-px flex-1 bg-border" />
        <span className={cn("font-medium", step === 2 ? "text-foreground" : "text-subtle")}>
          2. Details
        </span>
      </div>

      {error && (
        <div className="mb-5">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={goToDetails} className="space-y-4" noValidate>
          <div>
            <p className="mb-1.5 text-label text-foreground">I am joining as</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                aria-pressed={role === "PILOT"}
                onClick={() => setRole("PILOT")}
                className={cn(
                  "h-11 rounded-control border text-body font-medium transition-colors",
                  role === "PILOT"
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-border-strong"
                )}
              >
                Pilot
              </button>
              <button
                type="button"
                aria-pressed={role === "COMPANY"}
                onClick={() => setRole("COMPANY")}
                className={cn(
                  "h-11 rounded-control border text-body font-medium transition-colors",
                  role === "COMPANY"
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-border-strong"
                )}
              >
                Company
              </button>
            </div>
          </div>

          <Field
            label={role === "PILOT" ? "Full name" : "Contact name"}
            htmlFor="register-name-input"
            error={fieldErrors.name}
          >
            <Input
              id="register-name-input"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "PILOT" ? "Alex Rivera" : "Sarah Jenkins"}
              error={fieldErrors.name}
            />
          </Field>

          <Field label="Email" htmlFor="register-email-input" error={fieldErrors.email}>
            <Input
              id="register-email-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              error={fieldErrors.email}
            />
          </Field>

          <Field
            label="Password"
            htmlFor="register-password-input"
            hint="At least 6 characters."
            error={fieldErrors.password}
          >
            <PasswordInput
              id="register-password-input"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              error={fieldErrors.password}
            />
          </Field>

          <Button type="submit" block size="lg">
            Continue
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {role === "COMPANY" && (
            <>
              <Field label="Company name" htmlFor="register-company-name-input" error={fieldErrors.companyName}>
                <Input
                  id="register-company-name-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Skyline Engineering LLC"
                  error={fieldErrors.companyName}
                />
              </Field>
              <Field label="Industry" htmlFor="register-industry-select">
                <Select
                  id="register-industry-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="Agriculture & Forestry">Agriculture & Forestry</option>
                  <option value="Infrastructure & Utilities">Infrastructure & Utilities</option>
                  <option value="Real Estate & Construction">Real Estate & Construction</option>
                  <option value="Energy & Solar/Wind">Energy & Solar/Wind</option>
                  <option value="Land Surveying & Mining">Land Surveying & Mining</option>
                  <option value="Media & Cinema">Media & Cinema</option>
                  <option value="Commercial Services">Commercial Services</option>
                </Select>
              </Field>
            </>
          )}

          <Field label="Phone" htmlFor="register-phone-input" hint="Optional">
            <Input
              id="register-phone-input"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 019-2834"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="City" htmlFor="register-city-input" error={fieldErrors.city}>
              <Input
                id="register-city-input"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Austin"
                error={fieldErrors.city}
              />
            </Field>
            <Field label="State" htmlFor="register-state-input" error={fieldErrors.state}>
              <Input
                id="register-state-input"
                autoComplete="address-level1"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Texas"
                error={fieldErrors.state}
              />
            </Field>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button id="register-submit-btn" type="submit" className="flex-1" size="lg" disabled={loading}>
              {loading
                ? "Creating account…"
                : role === "PILOT"
                  ? "Create pilot account"
                  : "Create company account"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create an account"
      subtitle="Join Certified Drone Pilots as a pilot looking for work, or as a company hiring one."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Suspense fallback={<p className="text-body text-muted-foreground">Loading…</p>}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}