import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: "cyan" | "emerald" | "amber" | "blue" | "purple";
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = "cyan",
}: StatCardProps) {
  const colorMap = {
    cyan: "from-cyan-500/20 to-teal-500/5 text-cyan-400 border-cyan-500/30",
    emerald: "from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30",
    amber: "from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/30",
    blue: "from-blue-500/20 to-indigo-500/5 text-blue-400 border-blue-500/30",
    purple: "from-purple-500/20 to-pink-500/5 text-purple-400 border-purple-500/30",
  };

  const iconBgMap = {
    cyan: "bg-cyan-500/10 text-cyan-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
    blue: "bg-blue-500/10 text-blue-400",
    purple: "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0c142b] border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              {trend && (
                <span
                  className={`font-semibold ${
                    trendPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {trend}
                </span>
              )}
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${iconBgMap[color]} shadow-inner`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorMap[color]}`}
      />
    </div>
  );
}

export default StatCard;
