import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full rounded-control border bg-surface-2 px-3.5 text-body text-foreground",
          "transition-colors duration-150",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
          error ? "border-destructive" : "border-border",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";
