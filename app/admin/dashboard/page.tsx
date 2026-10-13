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
    <div className="space-y-6 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Operations & Compliance Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Platform governance, credential verification queues, and marketplace volume telemetry.
          </p>
        </div>

        <Button asChild variant="primary" size="sm">
          <Link href="/admin/certifications" className="gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Review Queue ({stats.pendingCertifications})</span>
          </Link>
        </Button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-control bg-warning/15 text-warning flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {stats.pendingCertifications} Pilot license submission{stats.pendingCertifications > 1 ? "s" : ""} require compliance verification
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Unverified pilots are restricted from bidding on high-compliance missions until cross-checked with aviation registries.
                </p>
              </div>
            </div>
            <Button asChild variant="secondary" size="sm" className="shrink-0">
              <Link href="/admin/certifications">Open Verification Queue →</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Role Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Account Composition</CardTitle>
            <CardDescription>Breakdown of enterprise accounts and registered pilots.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
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
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        color: "var(--text)",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground">No account data recorded</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border text-center text-xs">
              <div>
                <p className="font-semibold text-foreground">{stats.totalPilots}</p>
                <p className="text-subtle text-[11px]">Pilots</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">{stats.totalCompanies}</p>
                <p className="text-subtle text-[11px]">Companies</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">{stats.totalUsers}</p>
                <p className="text-subtle text-[11px]">Total Accounts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Missions by Industry */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-foreground">Mission Distribution</CardTitle>
            <CardDescription>Volume of posted operations categorized by sector.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
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
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        color: "var(--text)",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" fill="rgb(var(--primary-rgb))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground">No mission records found</p>
              )}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-border text-xs">
              <span className="text-muted-foreground">Total applications processed:</span>
              <span className="font-semibold text-foreground">{stats.applicationsCount} proposals</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/certifications"
          className="p-4 rounded-control border border-border bg-surface hover:bg-surface-2 transition-colors flex items-center justify-between"
        >
          <div>
            <h4 className="text-xs font-semibold text-foreground">Pilot Verification Roster</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">Approve and audit Part 107 licenses</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link
          href="/admin/users"
          className="p-4 rounded-control border border-border bg-surface hover:bg-surface-2 transition-colors flex items-center justify-between"
        >
          <div>
            <h4 className="text-xs font-semibold text-foreground">User Management</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">Inspect client and pilot profiles</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link
          href="/admin/jobs"
          className="p-4 rounded-control border border-border bg-surface hover:bg-surface-2 transition-colors flex items-center justify-between"
        >
          <div>
            <h4 className="text-xs font-semibold text-foreground">Mission Management</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">Oversee industrial postings</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
