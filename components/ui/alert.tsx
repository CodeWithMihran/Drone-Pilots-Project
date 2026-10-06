import React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "error" | "success" | "info";

const toneStyles: Record<AlertTone, string> = {
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  success: "border-success/30 bg-success/10 text-success",
  info: "border-border bg-surface-2 text-muted-foreground",
};

const icons: Record<AlertTone, React.ElementType> = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: AlertTone;
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = icons[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-control border px-3.5 py-3 text-caption",
        toneStyles[tone],
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
