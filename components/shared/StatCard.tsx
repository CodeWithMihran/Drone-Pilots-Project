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
  color?: "cyan" | "emerald" | "amber" | "blue" | "purple" | "default" | "warning" | "success" | "gold";
  variant?: "cyan" | "emerald" | "amber" | "blue" | "purple" | "default" | "warning" | "success" | "gold";
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
  const chosenColor = (variant || color || "gold") as string;
  const mappedColor = chosenColor === "warning" ? "amber" : chosenColor === "success" ? "emerald" : chosenColor;

  const iconBgMap: Record<string, string> = {
    gold: "bg-[#fabf28]/15 text-[#fabf28] border-[#fabf28]/25",
    cyan: "bg-[#fabf28]/15 text-[#fabf28] border-[#fabf28]/25",
    emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25",
    blue: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/25",
    purple: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/25",
    default: "bg-surface-2 dark:bg-zinc-900 text-muted-foreground border-border dark:border-zinc-800",
  };

  return (
    <div
      className={cn(
        "p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between select-none",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider truncate">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {value}
          </h3>
          
          {(subtitle || trend) && (
            <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
              {trend && (
                <span
                  className={cn(
                    "inline-flex items-center font-semibold",
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

        <div className={cn("w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 shadow-2xs", iconBgMap[mappedColor] || iconBgMap.gold)}>
          <Icon className="w-4 h-4 stroke-[2]" />
        </div>
      </div>
    </div>
  );
}

export default StatCard;
