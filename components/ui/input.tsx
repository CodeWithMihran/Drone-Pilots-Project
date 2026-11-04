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
          "peer flex h-11 w-full rounded-xl border bg-white dark:bg-zinc-900 px-4 py-2 text-xs text-foreground shadow-2xs transition-colors duration-150",
          "file:border-0 file:bg-transparent file:text-xs file:font-semibold file:text-foreground file:cursor-pointer",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#fabf28] focus-visible:border-[#fabf28]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error 
            ? "border-rose-500 focus-visible:ring-rose-500/40 focus-visible:border-rose-500" 
            : "border-zinc-200/90 dark:border-zinc-800 hover:border-zinc-350 dark:hover:border-zinc-700",
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
