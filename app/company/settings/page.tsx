"use client";

import React, { useState } from "react";
import { Settings, Lock, Bell, Building, CheckCircle2 } from "lucide-react";

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
        <h1 className="text-2xl font-bold text-white">Company Account Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure project proposal alerts, procurement settings, and organizational security.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Organization settings saved!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            Proposal & Flight Status Alerts
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-white">Instant Pilot Proposal Notifications</p>
                <p className="text-[11px] text-slate-400">Receive in-app and email alerts whenever a verified pilot bids on your tenders.</p>
              </div>
              <input
                type="checkbox"
                checked={proposalAlerts}
                onChange={(e) => setProposalAlerts(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-white">Mission Completion & Deliverable Alerts</p>
                <p className="text-[11px] text-slate-400">Notifies you immediately when an assigned pilot finishes flight operations.</p>
              </div>
              <input
                type="checkbox"
                checked={statusAlerts}
                onChange={(e) => setStatusAlerts(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 w-4 h-4"
              />
            </label>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            Security & Authentication
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
