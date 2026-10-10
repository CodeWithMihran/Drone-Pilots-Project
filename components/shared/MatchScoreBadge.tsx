import React from "react";
import { Zap } from "lucide-react";
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
    md: "px-2.5 py-0.5 text-xs gap-1.5",
    lg: "px-3 py-1 text-sm font-semibold gap-2",
  };

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium border ${colors.badge} ${sizeClasses[size]} transition-colors`}
      title="Based on certificate, location, equipment, and experience"
    >
      {showIcon && <Zap className="w-3 h-3 shrink-0" />}
      <span>{score}% match</span>
    </div>
  );
}

export default MatchScoreBadge;
