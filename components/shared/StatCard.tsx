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
  color?: "cyan" | "emerald" | "amber" | "blue" | "purple" | "default" | "warning" | "success";
  variant?: "cyan" | "emerald" | "amber" | "blue" | "purple" | "default" | "warning" | "success";
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
  const chosenColor = (variant || color || "cyan") as string;
  const mappedColor = chosenColor === "warning" ? "amber" : chosenColor === "success" ? "emerald" : chosenColor;


  const iconBgMap: Record<string, string> = {
    cyan: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-success/10 text-success border-success/20",
    amber: "bg-warning/10 text-warning border-warning/20",
    blue: "bg-info/10 text-info border-info/20",
    purple: "bg-primary/10 text-primary border-primary/20",
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

        <div className={cn("w-9 h-9 rounded-control border flex items-center justify-center shrink-0", iconBgMap[mappedColor] || iconBgMap.cyan)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;