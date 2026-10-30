import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-control text-[14px] font-medium tracking-tight whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: 
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white border border-zinc-900/10 dark:border-white/10 shadow-xs",
        secondary:
          "border border-border dark:border-zinc-800 bg-surface dark:bg-zinc-900 text-foreground hover:bg-surface-2 dark:hover:bg-zinc-850 hover:border-border-strong dark:hover:border-zinc-700 shadow-2xs",
        outline:
          "border border-border dark:border-zinc-800 bg-transparent text-foreground hover:bg-surface-2 dark:hover:bg-zinc-900 hover:border-border-strong dark:hover:border-zinc-700",
        ghost: 
          "text-muted-foreground hover:bg-surface-2 dark:hover:bg-zinc-900 hover:text-foreground",
        danger:
          "border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15",
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15",
        link: 
          "h-auto p-0 font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground",
      },
      size: {
        sm: "h-9 px-3 text-[13px]",
        md: "h-10 px-4",
        lg: "h-11 px-5 text-[14px]",
        icon: "h-10 w-10",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      block: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, type = "button", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        className={cn(buttonVariants({ variant, size, block, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { buttonVariants };
