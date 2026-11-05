"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Building,
  Briefcase,
  FileCheck2,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const stats = data?.stats || {
    totalUsers: 0,
    totalPilots: 0,
    totalCompanies: 0,
    pendingCertifications: 0,
    verifiedPilots: 0,
    activeJobs: 0,
    completedJobs: 0,
    applicationsCount: 0,
    totalPlatformVolume: 0,
  };

  const charts = data?.charts || {
    userDistribution: [],
    jobsByService: [],
    jobsByStatus: [],
    monthlyActivity: [],
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              GOVERNANCE & TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Platform Operations & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            AeroLink platform governance, pilot credential verification queues, escrow records, and transaction volumes.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Button asChild className="h-10 px-6 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs">
            <Link href="/admin/certifications" className="gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Review Queue ({stats.pendingCertifications})</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Verification Backlog"
          value={stats.pendingCertifications}
          subtitle="Part 107 reviews pending"
          icon={ShieldCheck}
          variant={stats.pendingCertifications > 0 ? "warning" : "default"}
        />
        <StatCard
          title="Verified Commercial Pilots"
          value={stats.verifiedPilots}
          subtitle={`Out of ${stats.totalPilots} registered`}
          icon={Users}
          variant="success"
        />
        <StatCard
          title="Active Missions"
          value={stats.activeJobs}
          subtitle="Open for proposals"
          icon={Briefcase}
          variant="default"
        />
        <StatCard
          title="Contract Volume"
          value={formatCurrency(stats.totalPlatformVolume || 0)}
          subtitle="Total awarded escrow"
          icon={DollarSign}
          variant="default"
        />
      </div>

      {/* Verification Action Banner if Pending */}
      {stats.pendingCertifications > 0 && (
        <div className="rounded-3xl border border-[#fabf28]/35 bg-[#fabf28]/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#fabf28] text-zinc-950 flex items-center justify-center shrink-0 font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {stats.pendingCertifications} Pilot license submission{stats.pendingCertifications > 1 ? "s" : ""} require compliance verification
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Unverified pilots are restricted from bidding on high-compliance missions until cross-checked with aviation registries.
              </p>
            </div>
          </div>
          <Button asChild variant="secondary" className="rounded-full px-5 h-9 text-xs font-semibold shrink-0 border border-zinc-300 dark:border-zinc-700">
            <Link href="/admin/certifications">Open Verification Queue →</Link>
          </Button>
        </div>
      )}

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Role Distribution */}
        <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">ACCOUNT COMPOSITION</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Breakdown of enterprise clients and registered pilots.</p>
          </div>
          <div className="pt-2">
            <div className="h-64 flex items-center justify-center">
              {charts.userDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.userDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {charts.userDistribution.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#fabf28" : index === 1 ? "#10b981" : "#71717a"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#121214",
                        borderColor: "#27272a",
                        borderRadius: "0.75rem",
                        color: "#f4f4f5",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground">No distribution telemetry yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Missions by Industry */}
        <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-4">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">MISSIONS BY INDUSTRY</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Distribution across commercial aerial sectors.</p>
          </div>
          <div className="pt-2">
            <div className="h-64 flex items-center justify-center">
              {charts.jobsByService.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.jobsByService}>
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#71717a" }} interval={0} />
                    <YAxis tick={{ fontSize: 10, fill: "#71717a" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#121214",
                        borderColor: "#27272a",
                        borderRadius: "0.75rem",
                        color: "#f4f4f5",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" fill="#fabf28" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground">No industry telemetry yet</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
