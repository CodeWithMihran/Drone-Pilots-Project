import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatServiceType(type: string): string {
  if (!type) return "";
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function getMatchScoreColor(score: number): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  if (score >= 85) {
    return {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    };
  }
  if (score >= 65) {
    return {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    };
  }
  if (score >= 45) {
    return {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    };
  }
  return {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/30",
    badge: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  };
}
