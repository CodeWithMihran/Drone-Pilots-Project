"use client";

import React, { useState } from "react";
import { Settings, Lock, Bell, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Pilot Account Preferences
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Account & Dispatch Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Configure notification channels, mission match thresholds, and credential security.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <Settings className="w-4 h-4 text-primary" />
          <span>Dispatch System Active</span>
        </div>
      </div>

      {saved && (
        <Alert variant="success">
          <span>Preferences updated successfully!</span>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification Preferences */}
        <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs space-y-4 hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300">
          <div className="pb-3 border-b border-border dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Dispatch & Mission Notifications
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select real-time dispatch alerts and contract event channels.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-4 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 cursor-pointer hover:border-border-strong dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-semibold text-foreground">High-Match Mission Dispatch</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Receive real-time alerts when projects matching &gt;80% of your fleet are posted in your flight radius.</p>
              </div>
              <input
                type="checkbox"
                checked={jobMatchAlerts}
                onChange={(e) => setJobMatchAlerts(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring w-4 h-4 ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 cursor-pointer hover:border-border-strong dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-semibold text-foreground">Milestone Escrow Notifications</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Immediate alerts upon client milestone authorization and escrow disbursements.</p>
              </div>
              <input
                type="checkbox"
                checked={paymentAlerts}
                onChange={(e) => setPaymentAlerts(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring w-4 h-4 ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 cursor-pointer hover:border-border-strong dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-semibold text-foreground">Email Digest & Tenders</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Weekly compilation of regional industrial drone opportunities.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring w-4 h-4 ml-4"
              />
            </label>
          </div>
        </div>

        {/* Security & Password */}
        <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs space-y-4 hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300">
          <div className="pb-3 border-b border-border dark:border-zinc-800">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Credentials & Security
            </h3>
          </div>

          <div className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="New Password">
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </Field>
              <Field label="Confirm New Password">
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
                />
              </Field>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="h-10 px-6 font-semibold text-xs"
        >
          Save Preferences
        </Button>
      </form>
    </div>
  );
}
