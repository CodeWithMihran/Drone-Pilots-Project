"use client";

import React, { useState } from "react";
import { Settings, Lock, Bell, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Alert } from "@/components/ui/alert";

export default function PilotSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [jobMatchAlerts, setJobMatchAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
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
              ACCOUNT & PREFERENCES
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Account & Notification Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Configure notification channels, mission match alerts, and security preferences.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
          <Settings className="w-4 h-4 text-[#fabf28]" />
          <span>Dispatch Active</span>
        </div>
      </div>

      {saved && (
        <Alert variant="success" className="rounded-2xl">
          <span>Preferences updated successfully!</span>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Notification Preferences */}
        <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-5 transition-all duration-200">
          <div className="pb-4 border-b border-border/80 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#fabf28]" />
              Dispatch & Mission Notifications
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select real-time dispatch alerts and contract event channels.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#faf8f5]/80 dark:bg-zinc-900 border border-border/80 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-bold text-foreground">High-Match Mission Dispatch</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Receive real-time alerts when projects matching &gt;80% of your fleet are posted in your flight radius.</p>
              </div>
              <input
                type="checkbox"
                checked={jobMatchAlerts}
                onChange={(e) => setJobMatchAlerts(e.target.checked)}
                className="rounded accent-[#fabf28] w-4 h-4 ml-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#faf8f5]/80 dark:bg-zinc-900 border border-border/80 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-bold text-foreground">Milestone Escrow Notifications</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Immediate alerts upon client milestone authorization and escrow disbursements.</p>
              </div>
              <input
                type="checkbox"
                checked={paymentAlerts}
                onChange={(e) => setPaymentAlerts(e.target.checked)}
                className="rounded accent-[#fabf28] w-4 h-4 ml-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-[#faf8f5]/80 dark:bg-zinc-900 border border-border/80 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-bold text-foreground">Email Digest & Briefs</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Weekly compilation of regional industrial drone opportunities.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded accent-[#fabf28] w-4 h-4 ml-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Security & Password */}
        <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-5 transition-all duration-200">
          <div className="pb-4 border-b border-border/80 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#fabf28]" />
              Security & Credentials
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update password and active authentication tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <Field label="Current Password" htmlFor="current-pw">
              <Input
                id="current-pw"
                type="password"
                placeholder="••••••••••••"
                className="rounded-xl bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
              />
            </Field>

            <Field label="New Password" htmlFor="new-pw">
              <Input
                id="new-pw"
                type="password"
                placeholder="••••••••••••"
                className="rounded-xl bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
              />
            </Field>
          </div>
        </div>

        <Button
          type="submit"
          className="h-11 px-8 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs"
        >
          Save Preferences
        </Button>
      </form>
    </div>
  );
}
