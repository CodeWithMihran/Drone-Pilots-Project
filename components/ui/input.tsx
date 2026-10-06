import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-control border bg-surface-2 px-3.5 text-body text-foreground placeholder:text-subtle",
          "transition-colors duration-150",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
          error ? "border-destructive" : "border-border",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
