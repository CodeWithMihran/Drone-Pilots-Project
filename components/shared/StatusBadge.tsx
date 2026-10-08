import React from "react";
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  CircleDot 
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        success: 
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        info: 
          "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
        primary: 
          "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
        warning: 
          "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
        destructive: 
          "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
        default: 
          "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  status: string;
  type?: "job" | "certification" | "application" | "payment" | "user";
}

export function StatusBadge({ 
  status, 
  type = "job", 
  className,
  ...props 
}: StatusBadgeProps) {
  const normalized = (status || "").toUpperCase();

  const getVariant = (): VariantProps<typeof badgeVariants>["variant"] => {
    switch (normalized) {
      case "VERIFIED":
      case "COMPLETED":
      case "ACCEPTED":
      case "PAID":
      case "ACTIVE":
        return "success";
      case "OPEN":
      case "APPLICATIONS_RECEIVED":
      case "AVAILABLE":
        return "info";
      case "PILOT_SELECTED":
      case "IN_PROGRESS":
      case "SHORTLISTED":
        return "primary";
      case "PENDING":
      case "BUSY":
        return "warning";
      case "REJECTED":
      case "CANCELLED":
      case "EXPIRED":
      case "SUSPENDED":
      case "FAILED":
      case "WITHDRAWN":
        return "destructive";
      default:
        return "default";
    }
  };

  const getIcon = () => {
    const iconProps = { className: "w-3.5 h-3.5" };
    
    if (normalized === "VERIFIED") return <ShieldCheck {...iconProps} />;
    if (["COMPLETED", "PAID", "ACCEPTED", "ACTIVE"].includes(normalized))
      return <CheckCircle2 {...iconProps} />;
    if (["PENDING", "IN_PROGRESS", "BUSY"].includes(normalized))
      return <Clock {...iconProps} />;
    if (["REJECTED", "CANCELLED", "SUSPENDED", "FAILED", "WITHDRAWN"].includes(normalized))
      return <XCircle {...iconProps} />;
    if (["EXPIRED", "SHORTLISTED"].includes(normalized))
      return <AlertTriangle {...iconProps} />;
    
    // Default fallback icon for OPEN, AVAILABLE, etc.
    return <CircleDot {...iconProps} />; 
  };

  const getLabel = () => {
    // Replaced the hardcoded '✓' since we now have proper Lucide icons
    if (normalized === "VERIFIED" && type === "user") return "Verified Pilot";
    if (normalized === "VERIFIED") return "Verified";
    
    return normalized
      .split("_")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <span
      className={cn(badgeVariants({ variant: getVariant() }), className)}
      {...props}
    >
      {getIcon()}
      {getLabel()}
    </span>
  );
}

export default StatusBadge;