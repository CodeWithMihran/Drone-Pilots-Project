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
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              COMPANY SETTINGS
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Company Preferences & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Configure project proposal alerts, procurement event triggers, and credential security.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
          <Building className="w-4 h-4 text-[#fabf28]" />
          <span>Procurement Active</span>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Organization settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Alerts Section */}
        <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-5 transition-all duration-200">
          <div className="pb-4 border-b border-border/80 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#fabf28]" />
              Proposal & Flight Status Alerts
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select notification triggers for bids received and milestone progress.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#faf8f5]/80 dark:bg-zinc-900 border border-border/80 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">Instant Pilot Proposal Notifications</p>
                <p className="text-[11px] text-muted-foreground">Receive real-time alerts whenever a verified pilot bids on your mission briefs.</p>
              </div>
              <input
                type="checkbox"
                checked={proposalAlerts}
                onChange={(e) => setProposalAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-[#fabf28] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#faf8f5]/80 dark:bg-zinc-900 border border-border/80 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">Mission Completion & Deliverable Alerts</p>
                <p className="text-[11px] text-muted-foreground">Notifies you immediately when an assigned pilot finishes operations and uploads deliverables.</p>
              </div>
              <input
                type="checkbox"
                checked={statusAlerts}
                onChange={(e) => setStatusAlerts(e.target.checked)}
                className="w-4 h-4 rounded accent-[#fabf28] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-5 transition-all duration-200">
          <div className="pb-4 border-b border-border/80 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#fabf28]" />
              Account Security & Password
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ensure authorized access across your corporate procurement team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="curr-pw">Current Password</Label>
              <Input
                id="curr-pw"
                type="password"
                placeholder="••••••••••••"
                className="rounded-xl bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-pw-input">New Password</Label>
              <Input
                id="new-pw-input"
                type="password"
                placeholder="••••••••••••"
                className="rounded-xl bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="h-11 px-8 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs"
        >
          Save Enterprise Settings
        </Button>
      </form>
    </div>
  );
}
