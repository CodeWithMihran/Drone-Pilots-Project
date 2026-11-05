import React from "react";
import { Check } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const points = [
  "FAA Part 107 airmen registry verified operators",
  "AI candidate matching in minutes, not days",
  "Underwritten milestone escrow payment protection",
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
      <aside className="relative hidden w-[44%] flex-col justify-between border-r border-zinc-200/80 dark:border-zinc-800/80 bg-[#faf8f5] dark:bg-[#0d1117] px-12 py-10 lg:flex select-none">
        <Logo />

        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#fabf28] font-bold text-base leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              OPERATIONS-GRADE FLIGHT NETWORK
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-foreground">
            Connecting industries with certified drone pilots.
          </h2>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The platform built for asset owners who need verified operators — and pilots who want to fly for a living.
          </p>
          <ul className="mt-8 space-y-3.5">
            {points.map((item) => (
              <li key={item} className="flex items-center gap-3 text-xs font-semibold text-foreground">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fabf28] text-zinc-950 font-bold shadow-2xs">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground font-mono">
          © {new Date().getFullYear()} AeroLink Inc.
        </p>
      </aside>

      <div className="flex flex-1 flex-col relative bg-white dark:bg-[#0d1117]">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-5 py-4 lg:hidden">
          <Logo size="sm" />
          <ThemeToggle />
        </div>
        <div className="hidden lg:flex absolute top-6 right-8 z-10">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px] animate-fade-in">
            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {children}

            {footer && <div className="mt-6 text-center text-xs text-muted-foreground">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthShell;
