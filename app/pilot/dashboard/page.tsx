"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  FileCheck2,
  Clock,
  CheckCircle2,
  DollarSign,
  Star,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Send,
  Zap,
  Award,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export default function PilotDashboardPage() {
  const [stats, setStats] = useState({
    availableJobs: 0,
    applicationsCount: 0,
    activeJobsCount: 0,
    completedJobsCount: 0,
    totalEarnings: 0,
    rating: 5.0,
    totalReviews: 0,
    isVerified: false,
    profileCompletion: 85,
  });

  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [sessionRes, jobsRes, myAppsRes, paymentsRes] = await Promise.all([
          fetch("/api/auth/session"),
          fetch("/api/jobs"),
          fetch("/api/applications/my"),
          fetch("/api/payments/my"),
        ]);

        const sessionData = await sessionRes.json();
        const jobsData = await jobsRes.json();
        const appsData = await myAppsRes.json();
        const paymentsData = await paymentsRes.json();

        const user = sessionData?.user;
        const allJobs = jobsData?.jobs || [];
        const myApps = appsData?.applications || [];
        const myPayments = paymentsData?.payments || [];

        // Active jobs (where pilot is assigned and status is PILOT_SELECTED or IN_PROGRESS)
        const active = allJobs.filter(
          (j: any) =>
            (j.assignedPilotId?._id === user?._id || j.assignedPilotId === user?._id) &&
            (j.status === "PILOT_SELECTED" || j.status === "IN_PROGRESS")
        );

        const completed = allJobs.filter(
          (j: any) =>
            (j.assignedPilotId?._id === user?._id || j.assignedPilotId === user?._id) &&
            j.status === "COMPLETED"
        );

        // Sort recommended jobs by match score
        const sortedRecommended = [...allJobs]
          .filter((j: any) => j.status === "OPEN" || j.status === "APPLICATIONS_RECEIVED")
          .sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0))
          .slice(0, 4);

        // Calculate profile completion
        let completion = 50;
        if (user?.profile?.bio) completion += 10;
        if (user?.profile?.equipment?.length > 0) completion += 15;
        if (user?.isVerified) completion += 25;

        setStats({
          availableJobs: allJobs.filter((j: any) => j.status === "OPEN" || j.status === "APPLICATIONS_RECEIVED").length,
          applicationsCount: myApps.length,
          activeJobsCount: active.length,
          completedJobsCount: completed.length,
          totalEarnings: paymentsData.totalEarnings || 0,
          rating: user?.profile?.rating || 5.0,
          totalReviews: user?.profile?.totalReviews || 0,
          isVerified: user?.isVerified || false,
          profileCompletion: Math.min(100, completion),
        });

        setRecommendedJobs(sortedRecommended);
        setActiveProjects(active);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner & Verification Alert */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0e1838] via-[#0c142b] to-[#070e22] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Pilot Operations Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Commercial Flight Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Track your matched projects, aviation certification status, live flight proposals, and escrow payouts.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            {stats.isVerified ? (
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>✓ VERIFIED PILOT (Part 107)</span>
              </div>
            ) : (
              <Link
                href="/pilot/certification"
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Upload Certificate (Pending)</span>
              </Link>
            )}

            {/* Profile Completion Bar */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Profile Completion:</span>
                <span className="text-cyan-400 font-bold">{stats.profileCompletion}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${stats.profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Real Database KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Available Jobs"
          value={stats.availableJobs}
          subtitle="Open for proposals"
          icon={Briefcase}
          color="cyan"
        />
        <StatCard
          title="Applications"
          value={stats.applicationsCount}
          subtitle="Submitted bids"
          icon={FileCheck2}
          color="blue"
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobsCount}
          subtitle="In flight operations"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={stats.completedJobsCount}
          subtitle="Missions finished"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Earnings"
          value={formatCurrency(stats.totalEarnings)}
          subtitle="Total payouts"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Rating"
          value={`${stats.rating.toFixed(1)} ★`}
          subtitle={`${stats.totalReviews} reviews`}
          icon={Star}
          color="purple"
        />
      </div>

      {/* Active Jobs in Progress Section */}
      {activeProjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Active Assigned Missions
            </h3>
            <Link href="/pilot/active-jobs" className="text-xs text-cyan-400 hover:underline">
              View All Active Projects →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.map((proj) => (
              <div
                key={proj._id}
                className="p-5 rounded-2xl bg-[#0c142b] border border-amber-500/30 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[11px] font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10">
                      {formatServiceType(proj.serviceType)}
                    </span>
                    <StatusBadge status={proj.status} type="job" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Client: {proj.companyId?.name} • Location: {proj.location?.city}, {proj.location?.state}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">{formatCurrency(proj.budget)}</span>
                  <Link
                    href={`/jobs/${proj._id}`}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Manage Mission
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Matched Jobs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              AI Algorithm Recommended Projects
            </h3>
            <p className="text-xs text-slate-400">
              Ranked automatically according to your Part 107 credentials, drone payload fleet, and location.
            </p>
          </div>
          <Link href="/pilot/jobs" className="text-xs text-cyan-400 hover:underline">
            Explore All Jobs →
          </Link>
        </div>

        {recommendedJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Open Jobs Available"
            description="All active jobs are currently assigned. Check back shortly for new industrial contracts."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedJobs.map((job) => (
              <div
                key={job._id}
                className="p-5 rounded-2xl bg-[#0c142b] border border-slate-800/80 shadow-lg hover:border-cyan-500/40 transition group flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-cyan-300 px-2 py-0.5 rounded-lg bg-cyan-500/10">
                      {formatServiceType(job.serviceType)}
                    </span>
                    {job.matchScore !== undefined && (
                      <MatchScoreBadge score={job.matchScore} size="sm" />
                    )}
                  </div>

                  <Link href={`/jobs/${job._id}`}>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                      {job.title}
                    </h4>
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-sm font-extrabold text-white">
                      {formatCurrency(job.budget)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {job.location?.city}, {job.location?.state}
                    </span>
                  </div>

                  <Link
                    href={`/jobs/${job._id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs transition flex items-center gap-1"
                  >
                    <span>View & Apply</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
