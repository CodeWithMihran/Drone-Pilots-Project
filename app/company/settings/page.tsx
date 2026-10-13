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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Company Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Configure project proposal alerts, procurement settings, and organizational security.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Organization settings saved!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Alerts Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Proposal & Flight Status Alerts
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-surface-2 border border-border cursor-pointer hover:border-border-strong transition-colors">
              <div className="space-y-0.5">
                <p className="text-[15px] font-semibold text-foreground">Instant Pilot Proposal Notifications</p>
                <p className="text-sm text-muted-foreground">Receive in-app and email alerts whenever a verified pilot bids on your tenders.</p>
              </div>
              <input
                type="checkbox"
                checked={proposalAlerts}
                onChange={(e) => setProposalAlerts(e.target.checked)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary/40 bg-background"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-surface-2 border border-border cursor-pointer hover:border-border-strong transition-colors">
              <div className="space-y-0.5">
                <p className="text-[15px] font-semibold text-foreground">Mission Completion & Deliverable Alerts</p>
                <p className="text-sm text-muted-foreground">Notifies you immediately when an assigned pilot finishes flight operations.</p>
              </div>
              <input
                type="checkbox"
                checked={statusAlerts}
                onChange={(e) => setStatusAlerts(e.target.checked)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary/40 bg-background"
              />
            </label>
          </div>
        </div>

        {/* Security Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Security & Authentication
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" block>
          Save Settings
        </Button>
      </form>
    </div>
  );
}