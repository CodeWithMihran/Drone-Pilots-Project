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
  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        success: 
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
        // "Open / Available" → golden/amber brand tone
        info: 
          "bg-[#fabf28]/15 text-zinc-900 dark:text-[#fabf28] border-[#fabf28]/35",
        primary: 
          "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-900/30 dark:border-white/30",
        warning: 
          "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
        destructive: 
          "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
        default: 
          "bg-zinc-100 dark:bg-zinc-850 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-750",
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
    switch (normalized) {
      case "VERIFIED":
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case "COMPLETED":
      case "ACCEPTED":
      case "PAID":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "PENDING":
        return <Clock className="w-3.5 h-3.5" />;
      case "REJECTED":
      case "CANCELLED":
      case "FAILED":
      case "EXPIRED":
      case "SUSPENDED":
        return <XCircle className="w-3.5 h-3.5" />;
      case "IN_PROGRESS":
      case "PILOT_SELECTED":
        return <CircleDot className="w-3.5 h-3.5" />;
      default:
        return <CircleDot className="w-3.5 h-3.5" />;
    }
  };

  const formatText = (text: string) => {
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <span
      className={cn(badgeVariants({ variant: getVariant() }), className)}
      {...props}
    >
      {getIcon()}
      <span>{formatText(status)}</span>
    </span>
  );
}

export default StatusBadge;
