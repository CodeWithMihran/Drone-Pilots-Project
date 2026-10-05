import React from "react";
import { Zap, CheckCircle2 } from "lucide-react";
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
  const colors = getMatchScoreColor(score);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-bold gap-2",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full font-semibold border ${colors.badge} ${sizeClasses[size]}`}
      title={`Algorithm Match Score: ${score}%`}
    >
      {showIcon && <Zap className="w-3.5 h-3.5 shrink-0 animate-pulse" />}
      <span>{score}% Match</span>
    </div>
  );
}

export default MatchScoreBadge;
