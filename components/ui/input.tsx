import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "peer flex h-11 w-full rounded-control border bg-background px-3.5 py-2 text-[15px] text-foreground shadow-sm transition-colors duration-150",
          "file:border-0 file:bg-transparent file:text-[15px] file:font-semibold file:text-foreground file:cursor-pointer",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error 
            ? "border-destructive focus-visible:ring-destructive/40 focus-visible:border-destructive" 
            : "border-border hover:border-border-strong",
          className
        )}
        ref={ref}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";