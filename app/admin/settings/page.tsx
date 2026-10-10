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
    <div className="max-w-3xl space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Compliance & Policy Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Marketplace compliance policies, aviation credential verification thresholds, and platform settings.
        </p>
      </div>

      {saved && (
        <Alert variant="success">
          <span>Platform compliance policies updated successfully!</span>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Aviation Regulatory Enforcement
            </CardTitle>
            <CardDescription>
              Rules governing pilot eligibility and verification enforcement.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-control bg-surface-2 border border-border cursor-pointer hover:border-border-strong transition-colors">
              <div>
                <p className="text-xs font-semibold text-foreground">Enforce Part 107 for Commercial Missions</p>
                <p className="text-[11px] text-muted-foreground">Strictly blocks unverified pilots from submitting bids on commercial projects.</p>
              </div>
              <input
                type="checkbox"
                checked={requirePart107Global}
                onChange={(e) => setRequirePart107Global(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring w-4 h-4 ml-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-control bg-surface-2 border border-border cursor-pointer hover:border-border-strong transition-colors">
              <div>
                <p className="text-xs font-semibold text-foreground">Automatic Expiration Revocation</p>
                <p className="text-[11px] text-muted-foreground">Automatically revokes verified pilot status when an aviation license passes its expiry date.</p>
              </div>
              <input
                type="checkbox"
                checked={autoVerifyExpiry}
                onChange={(e) => setAutoVerifyExpiry(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring w-4 h-4 ml-4"
              />
            </label>
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="primary"
          size="md"
        >
          Save Platform Policies
        </Button>
      </form>
    </div>
  );
}
