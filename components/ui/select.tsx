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
          "h-11 w-full rounded-xl border bg-white dark:bg-zinc-900 px-4 text-xs text-foreground shadow-2xs",
          "transition-colors duration-150",
          "focus:border-[#fabf28] focus:outline-none focus:ring-1 focus:ring-[#fabf28]",
          error ? "border-rose-500" : "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700",
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
