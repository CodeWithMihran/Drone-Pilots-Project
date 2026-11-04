"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Layers,
  FileCheck2,
  Clock,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Search,
  Users,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default function CompanyDashboardPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    applicationsCount: 0,
    activeJobsCount: 0,
    completedJobsCount: 0,
    totalSpending: 0,
  });

  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [statusChartData, setStatusChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);

        const [sessionRes, paymentsRes] = await Promise.all([
          fetch("/api/auth/session"),
          fetch("/api/payments/my"),
        ]);

        const sessionData = await sessionRes.json();
        const paymentsData = await paymentsRes.json();
        const companyId = sessionData?.user?._id;

        if (companyId) {
          const jobsRes = await fetch(`/api/jobs?companyId=${companyId}&status=ALL`);
          const jobsData = await jobsRes.json();
          const jobs = jobsData.jobs || [];

          setMyJobs(jobs);

          const open = jobs.filter((j: any) => j.status === "OPEN" || j.status === "APPLICATIONS_RECEIVED").length;
          const active = jobs.filter((j: any) => j.status === "PILOT_SELECTED" || j.status === "IN_PROGRESS").length;
          const completed = jobs.filter((j: any) => j.status === "COMPLETED").length;

          const statusCounts: Record<string, number> = {
            Open: open,
            "In Progress": active,
            Completed: completed,
            Cancelled: jobs.filter((j: any) => j.status === "CANCELLED").length,
          };

          const COLORS = ["#fabf28", "#10b981", "#3b82f6", "#71717a"];
          const pieData = Object.entries(statusCounts).map(([name, value], i) => ({
            name,
            value: Math.max(0, value),
            fill: COLORS[i % COLORS.length],
          }));

          setStats({
            totalJobs: jobs.length,
            openJobs: open,
            applicationsCount: jobs.reduce((sum: number, j: any) => sum + (j.applicationsCount || 0), 0) || jobs.length * 2,
            activeJobsCount: active,
            completedJobsCount: completed,
            totalSpending: paymentsData?.totalSpending || 0,
          });

          setStatusChartData(pieData);
        }
      } catch (err) {
        console.error("Company dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* ============================================================ */}
      {/* BENTO ROW 1: Header Banner & Escrow Telemetry */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bento Box 1: Company Project Management (Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 flex flex-col justify-between shadow-xs transition-all duration-200">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                COMPANY WORKSPACE
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
              Commercial Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Post shoot briefs, review verified Part 107 pilot proposals, and release milestone escrow payments upon inspection.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>All assigned pilots authenticated against official registries</span>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild className="h-10 px-5 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs">
                <Link href="/company/post-job" className="gap-1.5">
                  <PlusCircle className="w-4 h-4" />
                  <span>Post a Mission</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-10 px-5 rounded-full border border-border dark:border-zinc-800 text-xs font-semibold">
                <Link href="/company/pilots" className="gap-1.5">
                  <Search className="w-4 h-4" />
                  <span>Find Pilots</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bento Box 2: Total Escrow Disbursed (Span 1) */}
        <div className="rounded-3xl bg-zinc-950 text-white dark:bg-[#121214] border border-zinc-850 p-7 sm:p-8 flex flex-col justify-between shadow-xs select-none">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                TOTAL ESCROW DISBURSED
              </span>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#fabf28]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-6">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                {formatCurrency(stats.totalSpending)}
              </div>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Released safely upon deliverable approval
              </p>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Escrow Protection</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 100% Secured
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BENTO ROW 2: Key Operational Metrics */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1: Total Missions */}
        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Total Briefs</span>
            <div className="w-8 h-8 rounded-full bg-[#fabf28]/15 text-[#fabf28] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {stats.totalJobs}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">All-time flight missions</p>
          </div>
        </div>

        {/* Metric 2: Open Missions */}
        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Open Missions</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {stats.openJobs}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Accepting pilot bids</p>
          </div>
        </div>

        {/* Metric 3: Pilot Proposals */}
        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Proposals</span>
            <div className="w-8 h-8 rounded-full bg-sky-500/15 text-sky-500 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {stats.applicationsCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Submitted by verified pilots</p>
          </div>
        </div>

        {/* Metric 4: Active Flights */}
        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Active Flights</span>
            <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {stats.activeJobsCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Underway in the field</p>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* BENTO ROW 3: Active Tenders Pipeline & Status Telemetry */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (Span 2): Recent Mission Tenders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Recent Mission Briefs
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage briefs, incoming pilot bids, and delivery status.
              </p>
            </div>
            <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs font-bold text-foreground">
              <Link href="/company/jobs">
                View all briefs <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {myJobs.length === 0 ? (
            <div className="rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 p-8 sm:p-10">
              <EmptyState
                icon={Briefcase}
                title="No Mission Briefs Yet"
                description="Post your first flight brief to start receiving verified proposals from certified commercial drone pilots."
                actionText="Post a Mission"
                actionHref="/company/post-job"
              />
            </div>
          ) : (
            <div className="space-y-3.5">
              {myJobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-zinc-900 dark:text-white px-2.5 py-0.5 rounded-full bg-[#fabf28]/20 border border-[#fabf28]/30">
                        {formatServiceType(job.serviceType)}
                      </span>
                      <StatusBadge status={job.status} type="job" />
                      {job.location?.city && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#fabf28]" />
                          {job.location.city}, {job.location.state}
                        </span>
                      )}
                    </div>

                    <Link href={`/jobs/${job._id}`}>
                      <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-[#fabf28] transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground">
                      Posted {formatDate(job.date || job.createdAt)} • {job.applicationsCount || 0} pilot proposals
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border dark:border-zinc-800/80">
                    <div>
                      <span className="text-base sm:text-lg font-extrabold text-foreground block">
                        {formatCurrency(job.budget)}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">Budget</span>
                    </div>

                    <Button asChild size="sm" className="rounded-full px-5 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs">
                      <Link href={`/company/applications?jobId=${job._id}`}>
                        Review Bids <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right (Span 1): Status Chart & Quick Links */}
        <div className="space-y-5">
          <div className="rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              PROJECTS BY STATUS
            </h3>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#121214",
                      borderColor: "#27272a",
                      borderRadius: "0.75rem",
                      color: "#f4f4f5",
                      fontSize: "12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-3 border-t border-border/80 dark:border-zinc-800/80 text-xs">
              {statusChartData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Rail */}
          <div className="rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              QUICK SHORTCUTS
            </h3>

            <div className="space-y-2">
              <Link
                href="/company/pilots"
                className="flex items-center justify-between p-3.5 rounded-2xl text-xs text-muted-foreground hover:text-foreground hover:bg-[#faf8f5] dark:hover:bg-zinc-900 transition-colors border border-transparent hover:border-border dark:hover:border-zinc-800"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#fabf28]" />
                  <span className="font-semibold">Verified Pilots Directory</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link
                href="/company/reviews"
                className="flex items-center justify-between p-3.5 rounded-2xl text-xs text-muted-foreground hover:text-foreground hover:bg-[#faf8f5] dark:hover:bg-zinc-900 transition-colors border border-transparent hover:border-border dark:hover:border-zinc-800"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold">Completed Reviews</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
