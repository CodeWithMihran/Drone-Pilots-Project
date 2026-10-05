"use client";

import React, { useState } from "react";
import { Settings, Shield, Bell, CheckCircle2 } from "lucide-react";

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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Administration Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Marketplace compliance policies, aviation credential verification thresholds, and platform settings.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Platform policies updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Aviation Regulatory Enforcement
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-white">Enforce Part 107 for Industrial Tenders</p>
                <p className="text-[11px] text-slate-400">Strictly blocks unverified pilots from submitting bids on commercial projects.</p>
              </div>
              <input
                type="checkbox"
                checked={requirePart107Global}
                onChange={(e) => setRequirePart107Global(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-white">Automatic Expiration Revocation</p>
                <p className="text-[11px] text-slate-400">Automatically revokes the ✓ VERIFIED PILOT badge when a license passes its expiry date.</p>
              </div>
              <input
                type="checkbox"
                checked={autoVerifyExpiry}
                onChange={(e) => setAutoVerifyExpiry(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 w-4 h-4"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition"
        >
          Save Platform Policies
        </button>
      </form>
    </div>
  );
}
