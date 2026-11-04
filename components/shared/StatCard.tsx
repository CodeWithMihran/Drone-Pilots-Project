import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: "golden" | "emerald" | "amber" | "blue" | "purple" | "default" | "warning" | "success" | "cyan";
  variant?: "golden" | "emerald" | "amber" | "blue" | "purple" | "default" | "warning" | "success" | "cyan";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color,
  variant,
  className,
  ...props
}: StatCardProps) {
  // Map legacy color names to new golden palette
  const chosenColor = (variant || color || "golden") as string;
  const mappedColor =
    chosenColor === "warning" ? "amber"
    : chosenColor === "success" ? "emerald"
    : chosenColor === "cyan" ? "golden"
    : chosenColor === "purple" ? "golden"
    : chosenColor === "blue" ? "golden"
    : chosenColor;

  const iconBgMap: Record<string, string> = {
    golden: "bg-[#FFBD24]/15 text-[#8B6600] dark:text-[#FFBD24] border-[#FFBD24]/30",
    emerald: "bg-success/10 text-success border-success/20",
    amber: "bg-warning/10 text-warning border-warning/20",
    default: "bg-surface-2 dark:bg-zinc-900 text-muted-foreground border-border dark:border-zinc-800",
  };

  return (
    <div
      className={cn(
        "p-5 sm:p-6 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 shadow-xs hover:border-border-strong dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            {value}
          </h3>
          
          {(subtitle || trend) && (
            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center font-medium",
                    trendPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  )}
                >
                  {trendPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  )}
                  {trend}
                </span>
              )}
              <span className="truncate">{subtitle}</span>
            </div>
          )}
        </div>

        <div className={cn("w-9 h-9 rounded-control border flex items-center justify-center shrink-0", iconBgMap[mappedColor] || iconBgMap.golden)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
