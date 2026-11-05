"use client";

import React, { useState } from "react";
import { Shield, CheckCircle2, Lock, Bell, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const [autoVerifyExpiry, setAutoVerifyExpiry] = useState(true);
  const [requirePart107Global, setRequirePart107Global] = useState(true);
  const [instantNotifications, setInstantNotifications] = useState(true);
  const [escrowHoldDays, setEscrowHoldDays] = useState("3");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#fabf28] font-bold text-base leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              GOVERNANCE ARCHITECTURE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Compliance & Platform Controls
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Configure automated FAA Part 107 validation thresholds, escrow settlement gates, and global platform safeguards.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-850 border border-border/80 dark:border-zinc-800 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-foreground">FAA Airspace Compliance Active</span>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold">Platform compliance & regulatory policies updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Aviation Regulatory Enforcement Card */}
        <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#fabf28]" />
              Aviation Regulatory Enforcement
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rules governing pilot eligibility and credential verification across the dispatch network.
            </p>
          </div>

          <div className="space-y-3.5">
            <label className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-[#0d1117] border border-border/80 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-bold text-foreground">Enforce Part 107 for Commercial Missions</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Strictly blocks unverified pilots from submitting bids or accepting commercial projects.
                </p>
              </div>
              <input
                type="checkbox"
                checked={requirePart107Global}
                onChange={(e) => setRequirePart107Global(e.target.checked)}
                className="w-4 h-4 rounded text-[#fabf28] accent-[#fabf28] focus:ring-[#fabf28] ml-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-[#0d1117] border border-border/80 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-bold text-foreground">Automatic Expiration Revocation</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Automatically revokes verified badge status when an airman license or COI passes its expiration date.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoVerifyExpiry}
                onChange={(e) => setAutoVerifyExpiry(e.target.checked)}
                className="w-4 h-4 rounded text-[#fabf28] accent-[#fabf28] focus:ring-[#fabf28] ml-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Escrow & Financial Safeguards Card */}
        <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#fabf28]" />
              Escrow & Dispute Windows
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Default hold periods and dispute mediation intervals before automatic milestone release.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Client Review & Hold Window (Days)
              </label>
              <select
                value={escrowHoldDays}
                onChange={(e) => setEscrowHoldDays(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#0d1117] border border-border/80 dark:border-zinc-800 text-xs font-medium text-foreground focus:outline-none focus:border-[#fabf28]"
              >
                <option value="2">2 Days (Express)</option>
                <option value="3">3 Days (Standard Commercial)</option>
                <option value="5">5 Days (Enterprise Multi-Sensor)</option>
                <option value="7">7 Days (Survey & LiDAR)</option>
              </select>
            </div>

            <label className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-[#0d1117] border border-border/80 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors">
              <div>
                <p className="text-xs font-bold text-foreground">Real-time Dispute Alert Escalation</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Notify senior platform administrators via high-priority channel when deliverables are disputed.
                </p>
              </div>
              <input
                type="checkbox"
                checked={instantNotifications}
                onChange={(e) => setInstantNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-[#fabf28] accent-[#fabf28] focus:ring-[#fabf28] ml-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            className="h-11 px-8 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs tracking-tight shadow-md transition-all active:scale-[0.98]"
          >
            Save Platform Policies
          </button>
        </div>
      </form>
    </div>
  );
}
