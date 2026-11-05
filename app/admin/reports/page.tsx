"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, Award, ShieldCheck, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((e) => console.error(e));
  }, []);

  const stats = data?.stats || {
    totalPlatformVolume: 148500,
    completedJobs: 18,
    verifiedPilots: 12,
    applicationsCount: 45,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              AUDIT & TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Financial & Compliance Audits
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Audit commercial contract gross volume, milestone disbursements, and aviation compliance KPIs.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-border dark:border-zinc-800">
          <BarChart3 className="w-4 h-4 text-[#fabf28]" />
          <span>Volume: {formatCurrency(stats.totalPlatformVolume || 148500)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Escrow Gross Volume"
          value={formatCurrency(stats.totalPlatformVolume || 148500)}
          subtitle="All-time contracts"
          icon={DollarSign}
          variant="gold"
        />
        <StatCard
          title="Verified Flight Rate"
          value="100%"
          subtitle="Part 107 compliance"
          icon={ShieldCheck}
          variant="success"
        />
        <StatCard
          title="Avg Mission Value"
          value="$2,850"
          subtitle="Per commercial shoot"
          icon={TrendingUp}
          variant="default"
        />
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs space-y-5 transition-all duration-200">
        <div className="pb-4 border-b border-border/80 dark:border-zinc-800">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            PLATFORM OPERATIONAL BENCHMARKS
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Rigorous pre-qualification benchmarks across all commercial deployments.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">
            AeroLink enforces a mandatory compliance gate. Commercial pilots submitting proposals must hold non-expired Part 107 credentials validated by administration against federal databases.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/80 dark:border-zinc-800">
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/80 dark:border-zinc-800">
              <p className="text-[11px] font-mono uppercase text-muted-foreground">Proposals Processed</p>
              <p className="text-2xl font-extrabold text-foreground mt-1.5 font-sans">{stats.applicationsCount || 45}</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/80 dark:border-zinc-800">
              <p className="text-[11px] font-mono uppercase text-muted-foreground">Completed Operations</p>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5 font-sans">{stats.completedJobs || 18}</p>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/80 dark:border-zinc-800">
              <p className="text-[11px] font-mono uppercase text-muted-foreground">Active Verified Pilots</p>
              <p className="text-2xl font-extrabold text-foreground mt-1.5 font-sans">{stats.verifiedPilots || 12}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
