import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-[13px] font-semibold tracking-tight whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: 
          "bg-[#fabf28] text-zinc-950 hover:bg-[#e6ae22] shadow-xs font-bold",
        secondary:
          "border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 shadow-2xs",
        outline:
          "border border-zinc-200/90 dark:border-zinc-800 bg-transparent text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-zinc-350 dark:hover:border-zinc-700",
        ghost: 
          "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-foreground",
        danger:
          "border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15",
        destructive:
          "border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15",
        link: 
          "h-auto p-0 font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-10 px-5 text-xs",
        lg: "h-11 px-7 text-xs font-bold",
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
