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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Aviation Governance Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Operations & Compliance Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Platform governance, credential verification queues, enterprise escrow records, and marketplace volume telemetry.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Button asChild variant="primary" size="sm">
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
        <div className="rounded-panel border border-warning/30 bg-warning/5 dark:bg-amber-950/20 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-control bg-warning/15 text-warning flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {stats.pendingCertifications} Pilot license submission{stats.pendingCertifications > 1 ? "s" : ""} require compliance verification
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Unverified pilots are restricted from bidding on high-compliance missions until cross-checked with aviation registries.
              </p>
            </div>
          </div>
          <Button asChild variant="secondary" size="sm" className="shrink-0">
            <Link href="/admin/certifications">Open Verification Queue →</Link>
          </Button>
        </div>
      )}

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300 space-y-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Account Composition</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Breakdown of enterprise accounts and registered pilots.</p>
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
                          fill={index === 0 ? "rgb(var(--primary-rgb))" : index === 1 ? "rgb(var(--success-rgb))" : "#64748b"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface, #09090b)",
                        borderColor: "var(--color-border, #27272a)",
                        borderRadius: "8px",
                        color: "var(--color-text-main, #f4f4f5)",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground">No account data recorded</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-border dark:border-zinc-800/80 text-center text-xs">
              <div className="p-2.5 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
                <p className="font-semibold text-foreground text-base sm:text-lg">{stats.totalPilots}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">Pilots</p>
              </div>
              <div className="p-2.5 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
                <p className="font-semibold text-foreground text-base sm:text-lg">{stats.totalCompanies}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">Companies</p>
              </div>
              <div className="p-2.5 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
                <p className="font-semibold text-foreground text-base sm:text-lg">{stats.totalUsers}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5">Total Accounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Missions by Industry */}
        <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300 space-y-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Mission Distribution</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Volume of posted operations categorized by sector.</p>
          </div>
          <div className="pt-2">
            <div className="h-64 flex items-center justify-center">
              {charts.jobsByService.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.jobsByService}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                      interval={0}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-surface, #09090b)",
                        borderColor: "var(--color-border, #27272a)",
                        borderRadius: "8px",
                        color: "var(--color-text-main, #f4f4f5)",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                      }}
                    />
                    <Bar dataKey="count" fill="rgb(var(--primary-rgb))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground">No mission records found</p>
              )}
            </div>
            <div className="flex justify-between items-center pt-5 border-t border-border dark:border-zinc-800/80 text-xs">
              <span className="text-muted-foreground">Total applications processed:</span>
              <span className="font-semibold text-foreground">{stats.applicationsCount} proposals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link
          href="/admin/certifications"
          className="p-5 rounded-panel border border-border dark:border-zinc-800/80 bg-surface dark:bg-zinc-950/90 hover:border-border-strong dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group shadow-xs"
        >
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">Pilot Verification Roster</h4>
            <p className="text-xs text-muted-foreground mt-1">Approve and audit Part 107 licenses</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </Link>
        <Link
          href="/admin/users"
          className="p-5 rounded-panel border border-border dark:border-zinc-800/80 bg-surface dark:bg-zinc-950/90 hover:border-border-strong dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group shadow-xs"
        >
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">User Management</h4>
            <p className="text-xs text-muted-foreground mt-1">Inspect client and pilot profiles</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </Link>
        <Link
          href="/admin/jobs"
          className="p-5 rounded-panel border border-border dark:border-zinc-800/80 bg-surface dark:bg-zinc-950/90 hover:border-border-strong dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between group shadow-xs"
        >
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">Mission Management</h4>
            <p className="text-xs text-muted-foreground mt-1">Oversee industrial postings</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>
    </div>
  );
}
