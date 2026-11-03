import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  size = "md",
  showWordmark = true,
}: {
  href?: string;
  size?: "sm" | "md";
  showWordmark?: boolean;
}) {
  const iconSize = size === "sm" ? "w-8 h-8" : "w-9 h-9";

  return (
    <Link href={href} className="inline-flex items-center gap-2.5 text-foreground group select-none">
      {/* Bespoke Geometric Drone Mark */}
      <div
        className={cn(
          "rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-xs shrink-0",
          iconSize
        )}
      >
        <svg
          className="w-4 h-4 text-[#fabf28] fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93V18h-2v-1.07A6.002 6.002 0 0 1 6.07 13H5v-2h1.07A6.002 6.002 0 0 1 11 6.07V5h2v1.07A6.002 6.002 0 0 1 17.93 11H19v2h-1.07A6.002 6.002 0 0 1 13 16.93zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-[19px] font-extrabold tracking-tight text-foreground font-sans">
            Aero<span className="text-[#fabf28]">Link</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-750">
            Part 107
          </span>
        </div>
      )}
    </Link>
  );
}

export default Logo;
