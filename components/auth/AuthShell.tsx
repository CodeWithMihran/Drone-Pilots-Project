import React from "react";
import { Check } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const points = [
  "Part 107 certificates checked before you hire",
  "Jobs for inspection, mapping, spraying, and survey",
  "Clear proposals, payouts, and reviews in one place",
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="relative hidden w-[44%] flex-col justify-between border-r border-border bg-surface-2 px-12 py-10 lg:flex">
        <Logo />

        <div className="max-w-md">
          <h2 className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-foreground">
            Hire verified pilots for industrial drone work.
          </h2>
          <p className="mt-4 text-body text-muted-foreground">
            Built for companies that need certified operators — and pilots who want serious commercial jobs.
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((item) => (
              <li key={item} className="flex items-start gap-3 text-body text-foreground">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-caption text-subtle">Aether — Certified Drone Pilots</p>
      </aside>

      <div className="flex flex-1 flex-col relative">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
          <Logo size="sm" />
          <ThemeToggle />
        </div>
        <div className="hidden lg:flex absolute top-6 right-8 z-10">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px] animate-fade-in">
            <h1 className="text-heading-1 tracking-[-0.03em] text-foreground">{title}</h1>
            <p className="mt-2 text-body text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer ? <div className="mt-8 text-body text-muted-foreground">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
