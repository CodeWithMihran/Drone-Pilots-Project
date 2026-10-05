import React from "react";
import { ShieldCheck, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  type?: "job" | "certification" | "application" | "payment" | "user";
}

export function StatusBadge({ status, type = "job" }: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  const getBadgeStyle = () => {
    switch (normalized) {
      case "VERIFIED":
      case "COMPLETED":
      case "ACCEPTED":
      case "PAID":
      case "ACTIVE":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "OPEN":
      case "APPLICATIONS_RECEIVED":
      case "AVAILABLE":
        return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
      case "PILOT_SELECTED":
      case "IN_PROGRESS":
      case "SHORTLISTED":
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
      case "PENDING":
      case "BUSY":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "REJECTED":
      case "CANCELLED":
      case "EXPIRED":
      case "SUSPENDED":
      case "FAILED":
      case "WITHDRAWN":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-500/15 text-slate-300 border-slate-500/30";
    }
  };

  const getIcon = () => {
    if (normalized === "VERIFIED") return <ShieldCheck className="w-3.5 h-3.5" />;
    if (normalized === "COMPLETED" || normalized === "PAID" || normalized === "ACCEPTED")
      return <CheckCircle2 className="w-3.5 h-3.5" />;
    if (normalized === "PENDING" || normalized === "IN_PROGRESS")
      return <Clock className="w-3.5 h-3.5" />;
    if (normalized === "REJECTED" || normalized === "CANCELLED" || normalized === "SUSPENDED")
      return <XCircle className="w-3.5 h-3.5" />;
    return null;
  };

  const getLabel = () => {
    if (normalized === "VERIFIED") return "✓ VERIFIED PILOT";
    return normalized
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}
    >
      {getIcon()}
      {getLabel()}
    </span>
  );
}

export default StatusBadge;
