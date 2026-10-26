import React from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "error" | "success" | "info" | "warning";

const toneStyles: Record<AlertTone, string> = {
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  success: "border-success/30 bg-success/10 text-success",
  info: "border-border bg-surface-2 text-muted-foreground",
  warning: "border-warning/30 bg-warning/10 text-warning",
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
        "flex items-start gap-2.5 rounded-control border px-3.5 py-3 text-caption",
        toneStyles[chosenTone],
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="leading-relaxed flex-1">{children}</div>
    </div>
  );
}
