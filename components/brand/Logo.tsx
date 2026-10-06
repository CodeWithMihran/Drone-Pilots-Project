import React from "react";
import Link from "next/link";
import { Navigation } from "lucide-react";
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
  const mark = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <Link href={href} className="inline-flex items-center gap-2.5 text-foreground">
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-control bg-primary/15 text-primary",
          mark
        )}
      >
        <Navigation className={cn(icon, "-rotate-45")} />
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-[17px] font-semibold tracking-[-0.02em]">Aether</span>
          <span className="mt-0.5 text-[11px] font-normal text-muted-foreground">
            Certified drone pilots
          </span>
        </span>
      )}
    </Link>
  );
}
