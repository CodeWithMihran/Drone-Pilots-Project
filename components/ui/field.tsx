import React from "react";
import { Label } from "./label";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p className="mt-1.5 text-caption text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-caption text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}
