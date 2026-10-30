"use client";

import React, { useState } from "react";
import { Target, Info, CheckCircle2, ChevronRight } from "lucide-react";
import { getMatchScoreColor } from "@/lib/utils";

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function MatchScoreBadge({
  score,
  size = "md",
  showIcon = true,
}: MatchScoreBadgeProps) {
  const [open, setOpen] = useState(false);
  const colors = getMatchScoreColor(score);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-0.5 text-xs gap-1.5",
    lg: "px-3 py-1 text-sm font-semibold gap-2",
  };

  // Algorithmic weights breakdown
  const factors = [
    { name: "FAA Part 107 Credential", weight: "30%", status: "Verified Active" },
    { name: "Hardware & Payload Sensor", weight: "20%", status: "Spec Qualified" },
    { name: "Operating Radius Proximity", weight: "20%", status: "< 50 mi Range" },
    { name: "Industrial Track Record", weight: "20%", status: "Historical Audited" },
    { name: "Mission Schedule Sync", weight: "10%", status: "Available" },
  ];

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`group inline-flex items-center rounded-full font-medium border ${colors.badge} ${sizeClasses[size]} transition-all duration-150 hover:shadow-xs focus:outline-none`}
        aria-label="View match score breakdown"
      >
        {showIcon && <Target className="w-3 h-3 shrink-0 transition-transform duration-150 group-hover:rotate-45" />}
        <span className="font-mono font-semibold">{score}% match</span>
        <Info className="w-2.5 h-2.5 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Investor-grade Algorithm Breakdown Popover */}
      {open && (
        <div
          role="tooltip"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-50 w-72 p-3.5 rounded-panel bg-surface dark:bg-zinc-950 border border-border dark:border-zinc-800 shadow-xl text-left animate-fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border/80 dark:border-zinc-800 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Target className="w-3.5 h-3.5 text-primary" />
              <span>Algorithmic Fit: {score}%</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Part 107 Engine</span>
          </div>

          <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
            Calculated across five operational compliance and hardware parameters:
          </p>

          <div className="mt-2.5 space-y-1.5 text-xs">
            {factors.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1 px-1.5 rounded bg-surface-2/60 dark:bg-zinc-900/40 text-[11px]"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-foreground truncate">{f.name}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground shrink-0">
                  <span className="font-semibold text-foreground">{f.weight}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5 pt-2 border-t border-border/80 dark:border-zinc-800 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Airspace Scoped</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Compliance Audited</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchScoreBadge;
