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

  const colorMap: Record<string, string> = {
    cyan: "from-primary to-primary-hover",
    emerald: "from-emerald-500 to-teal-400",
    amber: "from-amber-500 to-orange-400",
    blue: "from-blue-500 to-indigo-400",
    purple: "from-purple-500 to-pink-400",
    default: "from-border to-border-strong",
  };

  const iconBgMap: Record<string, string> = {
    cyan: "bg-primary/10 text-primary",
    emerald: "bg-success/10 text-success",
    amber: "bg-warning/10 text-warning",
    blue: "bg-info/10 text-info",
    purple: "bg-primary/10 text-primary",
    default: "bg-surface-2 text-muted-foreground",
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

        <div className={cn("p-2.5 rounded-control", iconBgMap[mappedColor] || iconBgMap.cyan)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r opacity-80 group-hover:opacity-100 transition-opacity",
          colorMap[mappedColor] || colorMap.cyan
        )}
      />
    </div>
  );
}

export default StatCard;