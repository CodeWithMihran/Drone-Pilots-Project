import React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
  labelClassName,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className={cn("mb-2 block", labelClassName)}>
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-caption text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-caption text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}
