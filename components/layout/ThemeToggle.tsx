"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-[#faf8f5] dark:bg-zinc-900 flex items-center justify-center opacity-60",
          className
        )}
        aria-hidden="true"
      >
        <span className="w-4 h-4" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-9 h-9 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-[#faf8f5] dark:bg-zinc-900 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-all shadow-2xs focus-visible:outline-none",
        className
      )}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#fabf28] transition-transform duration-200 rotate-0 scale-100" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 dark:text-zinc-300 transition-transform duration-200 rotate-0 scale-100" />
      )}
    </button>
  );
}
