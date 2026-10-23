"use client";

import React, { useState } from "react";
import { Settings, Lock, Bell, Building, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CompanySettingsPage() {
  const [proposalAlerts, setProposalAlerts] = useState(true);
  const [statusAlerts, setStatusAlerts] = useState(true);
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
              Organization Governance Preferences
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Enterprise Settings & Dispatch Alerts
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Configure project proposal alerts, procurement event triggers, and credential security.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <Building className="w-4 h-4 text-primary" />
          <span>Procurement Active</span>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-panel bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Organization settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Alerts Section */}
        <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs space-y-4 hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300">
          <div className="pb-3 border-b border-border dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Proposal & Flight Status Alerts
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select notification triggers for bids received and milestone progress.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-4 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 cursor-pointer hover:border-border-strong dark:hover:border-zinc-700 transition-colors">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Instant Pilot Proposal Notifications</p>
                <p className="text-[11px] text-muted-foreground">Receive real-time alerts whenever a verified pilot bids on your mission tenders.</p>
              </div>
              <input
                type="checkbox"
                checked={proposalAlerts}
                onChange={(e) => setProposalAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-ring bg-surface"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 cursor-pointer hover:border-border-strong dark:hover:border-zinc-700 transition-colors">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">Mission Completion & Deliverable Alerts</p>
                <p className="text-[11px] text-muted-foreground">Notifies you immediately when an assigned pilot finishes operations and uploads telemetry.</p>
              </div>
              <input
                type="checkbox"
                checked={statusAlerts}
                onChange={(e) => setStatusAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-ring bg-surface"
              />
            </label>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs space-y-4 hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300">
          <div className="pb-3 border-b border-border dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Security & Authentication
            </h3>
          </div>

          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="h-10 px-6 font-semibold text-xs"
        >
          Save Settings
        </Button>
      </form>
    </div>
  );
}