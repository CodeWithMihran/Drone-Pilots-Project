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
  color?: "cyan" | "emerald" | "amber" | "blue" | "purple" | "default";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = "cyan",
  className,
  ...props
}: StatCardProps) {
  // Simplified gradient maps for the bottom accent line
  const colorMap = {
    cyan: "from-cyan-500 to-teal-400",
    emerald: "from-emerald-500 to-teal-400",
    amber: "from-amber-500 to-orange-400",
    blue: "from-blue-500 to-indigo-400",
    purple: "from-purple-500 to-pink-400",
    default: "from-slate-500 to-slate-400",
  };

  // Adaptive background and text colors for light/dark mode support
  const iconBgMap = {
    cyan: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    blue: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    default: "bg-slate-500/10 text-slate-700 dark:text-slate-400",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden p-5 rounded-2xl bg-card border border-border shadow-sm group hover:border-border-strong transition-colors duration-200",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
              <span>{subtitle}</span>
            </div>
          )}
        </div>

        <div className={cn("p-3 rounded-xl shadow-inner", iconBgMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80 group-hover:opacity-100 transition-opacity",
          colorMap[color]
        )}
      />
    </div>
  );
}

export default StatCard;