import React from "react";
import Link from "next/link";
import { LucideIcon, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = HelpCircle,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="py-16 px-6 text-center rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 my-4 flex flex-col items-center justify-center shadow-xs transition-colors">
      <div className="w-14 h-14 rounded-2xl bg-[#fabf28]/15 border border-[#fabf28]/30 flex items-center justify-center text-[#fabf28] mb-4 shadow-2xs">
        <Icon className="w-6 h-6 stroke-[1.8]" />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1 tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && actionHref && (
        <Button asChild className="rounded-full px-6 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs">
          <Link href={actionHref}>{actionText}</Link>
        </Button>
      )}
      {actionText && onAction && !actionHref && (
        <Button onClick={onAction} className="rounded-full px-6 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs">
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
