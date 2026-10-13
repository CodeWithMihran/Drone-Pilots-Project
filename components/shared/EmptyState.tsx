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
    <div className="py-14 px-6 text-center rounded-panel bg-surface border border-border my-4 flex flex-col items-center justify-center transition-colors">
      <div className="w-12 h-12 rounded-control bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && actionHref && (
        <Button asChild variant="primary" size="sm">
          <Link href={actionHref}>{actionText}</Link>
        </Button>
      )}
      {actionText && onAction && !actionHref && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
