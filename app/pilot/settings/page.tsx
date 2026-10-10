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
    <div className="max-w-3xl space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Account & Dispatch Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure notification thresholds, dispatch alerts, and credentials security.
        </p>
      </div>

      {saved && (
        <Alert variant="success">
          <span>Preferences updated successfully!</span>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification Preferences */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Dispatch & Mission Notifications
            </CardTitle>
            <CardDescription>
              Select real-time dispatch alerts and contract event channels.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-control bg-surface-2 border border-border cursor-pointer hover:border-border-strong transition-colors">
              <div>
                <p className="text-xs font-semibold text-foreground">High-Match Mission Dispatch</p>
                <p className="text-[11px] text-muted-foreground">Receive real-time alerts when projects matching &gt;80% of your fleet are posted in your flight radius.</p>
              </div>
              <input
                type="checkbox"
                checked={jobMatchAlerts}
                onChange={(e) => setJobMatchAlerts(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring w-4 h-4 ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-control bg-surface-2 border border-border cursor-pointer hover:border-border-strong transition-colors">
              <div>
                <p className="text-xs font-semibold text-foreground">Milestone Escrow Notifications</p>
                <p className="text-[11px] text-muted-foreground">Immediate alerts upon client milestone authorization and escrow disbursements.</p>
              </div>
              <input
                type="checkbox"
                checked={paymentAlerts}
                onChange={(e) => setPaymentAlerts(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring w-4 h-4 ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-control bg-surface-2 border border-border cursor-pointer hover:border-border-strong transition-colors">
              <div>
                <p className="text-xs font-semibold text-foreground">Email Digest & Tenders</p>
                <p className="text-[11px] text-muted-foreground">Weekly compilation of regional industrial drone opportunities.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring w-4 h-4 ml-4"
              />
            </label>
          </CardContent>
        </Card>

        {/* Security & Password */}
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Credentials & Security
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="New Password">
                <Input
                  type="password"
                  placeholder="••••••••"
                />
              </Field>
              <Field label="Confirm New Password">
                <Input
                  type="password"
                  placeholder="••••••••"
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="primary"
          size="md"
        >
          Save Preferences
        </Button>
      </form>
    </div>
  );
}
