"use client";

import React, { useState } from "react";
import { Settings, Shield, Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export default function AdminSettingsPage() {
  const [autoVerifyExpiry, setAutoVerifyExpiry] = useState(true);
  const [requirePart107Global, setRequirePart107Global] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Aviation Regulatory Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Compliance & Platform Policies
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Configure automated FAA license validation thresholds, commercial bidding eligibility gates, and global platform compliance.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <Shield className="w-4 h-4 text-success" />
          <span>FAA Part 107 Gated</span>
        </div>
      </div>

      {saved && (
        <Alert variant="success">
          <span>Platform compliance policies updated successfully!</span>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs space-y-4 hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300">
          <div className="pb-3 border-b border-border dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Aviation Regulatory Enforcement
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rules governing pilot eligibility and verification enforcement.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-4 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 cursor-pointer hover:border-border-strong dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-semibold text-foreground">Enforce Part 107 for Commercial Missions</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Strictly blocks unverified pilots from submitting bids on commercial projects.</p>
              </div>
              <input
                type="checkbox"
                checked={requirePart107Global}
                onChange={(e) => setRequirePart107Global(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring w-4 h-4 ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 cursor-pointer hover:border-border-strong dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-semibold text-foreground">Automatic Expiration Revocation</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Automatically revokes verified pilot status when an aviation license passes its expiry date.</p>
              </div>
              <input
                type="checkbox"
                checked={autoVerifyExpiry}
                onChange={(e) => setAutoVerifyExpiry(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring w-4 h-4 ml-4"
              />
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="h-10 px-6 font-semibold text-xs"
        >
          Save Platform Policies
        </Button>
      </form>
    </div>
  );
}
