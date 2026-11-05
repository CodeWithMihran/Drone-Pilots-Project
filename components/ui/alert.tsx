import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "error" | "success" | "info" | "warning";

const toneStyles: Record<AlertTone, string> = {
  error: "border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300",
  success: "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300",
  info: "border-zinc-200 dark:border-zinc-800 bg-[#faf8f5] dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200",
  warning: "border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300",
};

const icons: Record<AlertTone, React.ElementType> = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
};

export function Alert({
  tone,
  variant,
  children,
  className,
}: {
  tone?: AlertTone;
  variant?: AlertTone;
  children: React.ReactNode;
  className?: string;
}) {
  const chosenTone: AlertTone = variant || tone || "info";
  const Icon = icons[chosenTone] || Info;

  return (
    <div
      role={chosenTone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs",
        toneStyles[chosenTone],
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="leading-relaxed flex-1 font-medium">{children}</div>
    </div>
  );
}
