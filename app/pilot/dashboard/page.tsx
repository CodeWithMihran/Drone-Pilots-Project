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
  AlertCircle,
  ChevronRight,
  ArrowRight,
  MapPin,
  SlidersHorizontal,
  Compass,
  FileText,
  BadgeCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PilotDashboardPage() {
  const [user, setUser] = useState<any>(null);
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

  const [matchingJobs, setMatchingJobs] = useState<any[]>([]);
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

        const currentUser = sessionData?.user;
        setUser(currentUser);

        const allJobs = jobsData?.jobs || [];
        const myApps = appsData?.applications || [];

        // Active jobs (where pilot is assigned and status is PILOT_SELECTED or IN_PROGRESS)
        const active = allJobs.filter(
          (j: any) =>
            (j.assignedPilotId?._id === currentUser?._id || j.assignedPilotId === currentUser?._id) &&
            (j.status === "PILOT_SELECTED" || j.status === "IN_PROGRESS")
        );

        const completed = allJobs.filter(
          (j: any) =>
            (j.assignedPilotId?._id === currentUser?._id || j.assignedPilotId === currentUser?._id) &&
            j.status === "COMPLETED"
        );

        // Sort matching jobs by match score
        const sortedMatching = [...allJobs]
          .filter((j: any) => j.status === "OPEN" || j.status === "APPLICATIONS_RECEIVED")
          .sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0))
          .slice(0, 4);

        // Calculate profile completion
        let completion = 50;
        if (currentUser?.profile?.bio) completion += 10;
        if (currentUser?.profile?.equipment?.length > 0) completion += 15;
        if (currentUser?.isVerified) completion += 25;

        setStats({
          availableJobs: allJobs.filter((j: any) => j.status === "OPEN" || j.status === "APPLICATIONS_RECEIVED").length,
          applicationsCount: myApps.length,
          activeJobsCount: active.length,
          completedJobsCount: completed.length,
          totalEarnings: paymentsData?.totalEarnings || 0,
          rating: currentUser?.profile?.rating || 5.0,
          totalReviews: currentUser?.profile?.totalReviews || 0,
          isVerified: currentUser?.isVerified || false,
          profileCompletion: Math.min(100, completion),
        });

        setMatchingJobs(sortedMatching);
        setActiveProjects(active);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pilotName = user?.name || "Pilot";

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* ============================================================ */}
      {/* BENTO ROW 1: Hero Header & Payout Overview */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bento Tile 1: Pilot Status & Mission Readiness (Span 2) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 flex flex-col justify-between shadow-xs transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
                <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                  PILOT WORKSPACE
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                Welcome back, {pilotName}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                Review your active assignments, open missions tailored to your kit, and verified Part 107 flight credentials.
              </p>
            </div>

            {/* Credential Badge */}
            <div className="shrink-0">
              {stats.isVerified ? (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  <span>FAA Part 107 Verified</span>
                </div>
              ) : (
                <Link
                  href="/pilot/certification"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fabf28]/15 border border-[#fabf28]/30 text-zinc-900 dark:text-[#fabf28] text-xs font-bold hover:bg-[#fabf28]/25 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 text-[#fabf28]" />
                  <span>Verification Pending</span>
                </Link>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/80 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            {/* Profile completion bar */}
            <div className="flex-1 max-w-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Profile Readiness</span>
                <span className="text-foreground">{stats.profileCompletion}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden border border-border/50 dark:border-zinc-800">
                <div
                  className="h-full bg-[#fabf28] transition-all duration-500 rounded-full"
                  style={{ width: `${stats.profileCompletion}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild className="h-10 px-5 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs">
                <Link href="/pilot/jobs" className="gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>Find Missions</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" className="h-10 px-5 rounded-full border border-border dark:border-zinc-800 text-xs font-semibold">
                <Link href="/pilot/profile" className="gap-1.5">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bento Tile 2: Escrow Earnings (Span 1) */}
        <div className="rounded-3xl bg-zinc-950 text-white dark:bg-[#161b22] border border-zinc-850 p-7 sm:p-8 flex flex-col justify-between shadow-xs select-none">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                ESCROW EARNINGS
              </span>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#fabf28]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-6">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
                {formatCurrency(stats.totalEarnings)}
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                Total disbursed from completed shoots
              </p>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Direct Bank Payout</span>
            <Link
              href="/pilot/earnings"
              className="text-xs font-bold text-[#fabf28] hover:underline inline-flex items-center gap-1"
            >
              <span>View ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BENTO ROW 2: Core Metrics */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1 */}
        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Open Missions</span>
            <div className="w-8 h-8 rounded-full bg-[#fabf28]/15 text-[#fabf28] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {stats.availableJobs}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Accepting pilot bids</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Submitted Bids</span>
            <div className="w-8 h-8 rounded-full bg-sky-500/15 text-sky-500 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {stats.applicationsCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Active proposals in review</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
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
            <p className="text-[11px] text-muted-foreground mt-1">
              {stats.activeJobsCount > 0 ? "Underway right now" : "Ready for deployment"}
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Client Rating</span>
            <div className="w-8 h-8 rounded-full bg-[#fabf28]/15 text-[#fabf28] flex items-center justify-center">
              <Star className="w-4 h-4 fill-[#fabf28]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              <span>{stats.rating.toFixed(1)}</span>
              <span className="text-xs font-medium text-muted-foreground">/ 5.0</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{stats.totalReviews} verified reviews</p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BENTO ROW 3: Active Deployments (Conditional) */}
      {/* ============================================================ */}
      {activeProjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#fabf28] animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Active Mission Deployments
              </h2>
            </div>
            <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs font-bold text-foreground">
              <Link href="/pilot/active-jobs">
                View all ({activeProjects.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeProjects.map((proj) => (
              <div
                key={proj._id}
                className="p-7 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[11px] font-bold text-zinc-950 dark:text-white px-3 py-1 rounded-full bg-[#fabf28]">
                      {formatServiceType(proj.serviceType)}
                    </span>
                    <StatusBadge status={proj.status} type="job" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">{proj.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span>Client: <strong className="font-semibold text-foreground">{proj.companyId?.name || "Enterprise"}</strong></span>
                    {proj.location?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#fabf28]" />
                        {proj.location.city}, {proj.location.state}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-border/80 dark:border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-mono">MISSION ESCROW</span>
                    <span className="text-base font-extrabold text-foreground">{formatCurrency(proj.budget)}</span>
                  </div>
                  <Button asChild size="sm" className="rounded-full px-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold text-xs">
                    <Link href={`/jobs/${proj._id}`}>Manage Shoot</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* BENTO ROW 4: Matching Mission Postings & Checklist */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Span 2): Matching Missions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Matching Mission Postings
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Targeted shoots matching your airframe equipment and location.
              </p>
            </div>
            <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs font-bold text-foreground hidden sm:inline-flex">
              <Link href="/pilot/jobs">
                Browse all <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          {matchingJobs.length === 0 ? (
            <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-8">
              <EmptyState
                icon={Briefcase}
                title="No Open Tenders Currently"
                description="All current mission tenders have been filled. New enterprise flight tenders are published regularly."
                actionText="Explore All Jobs"
                actionHref="/pilot/jobs"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {matchingJobs.map((job) => (
                <div
                  key={job._id}
                  className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-zinc-900 dark:text-white px-2.5 py-0.5 rounded-full bg-[#fabf28]/20 border border-[#fabf28]/30">
                        {formatServiceType(job.serviceType)}
                      </span>
                      {job.matchScore !== undefined && (
                        <MatchScoreBadge score={job.matchScore} size="sm" />
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#fabf28]" />
                        {job.location?.city || "Field Site"}, {job.location?.state || ""}
                      </span>
                    </div>

                    <Link href={`/jobs/${job._id}`}>
                      <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-[#fabf28] transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border dark:border-zinc-800">
                    <div>
                      <span className="text-base sm:text-lg font-extrabold text-foreground block">
                        {formatCurrency(job.budget)}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">Escrow Secured</span>
                    </div>

                    <Button asChild size="sm" className="rounded-full px-5 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs">
                      <Link href={`/jobs/${job._id}`}>
                        Apply <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Span 1): Compliance & Actions */}
        <div className="space-y-5">
          <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                FLIGHT COMPLIANCE
              </h3>
              <ShieldCheck className="w-4 h-4 text-[#fabf28]" />
            </div>

            <div className="space-y-3.5 divide-y divide-border/80 dark:divide-zinc-800/80 text-xs">
              <div className="pt-2 first:pt-0 flex items-center justify-between">
                <span className="text-muted-foreground">FAA Part 107 Airman</span>
                {stats.isVerified ? (
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Validated
                  </span>
                ) : (
                  <span className="font-semibold text-[#fabf28] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Action Needed
                  </span>
                )}
              </div>

              <div className="pt-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">COI Insurance</span>
                <span className="font-semibold text-foreground">Verified Policy</span>
              </div>

              <div className="pt-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Airframe Registration</span>
                <span className="font-semibold text-foreground">On File</span>
              </div>

              <div className="pt-2.5 flex items-center justify-between">
                <span className="text-muted-foreground">Safety Record</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Zero Incidents</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/80 dark:border-zinc-800/80">
              <Button asChild variant="secondary" size="sm" className="w-full rounded-full text-xs font-semibold h-10 border border-border dark:border-zinc-800">
                <Link href="/pilot/certification">
                  Update Certifications & COI
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              QUICK SHORTCUTS
            </h3>

            <div className="space-y-2">
              <Link
                href="/pilot/applications"
                className="flex items-center justify-between p-3.5 rounded-2xl text-xs text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-border dark:hover:border-zinc-800"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#fabf28]" />
                  <span className="font-semibold">Submitted Proposals</span>
                </div>
                <span className="font-bold text-foreground px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px]">{stats.applicationsCount}</span>
              </Link>

              <Link
                href="/pilot/reviews"
                className="flex items-center justify-between p-3.5 rounded-2xl text-xs text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-border dark:hover:border-zinc-800"
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-[#fabf28]" />
                  <span className="font-semibold">Client Ratings</span>
                </div>
                <span className="font-bold text-foreground px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px]">{stats.totalReviews}</span>
              </Link>

              <Link
                href="/pilot/settings"
                className="flex items-center justify-between p-3.5 rounded-2xl text-xs text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-border dark:hover:border-zinc-800"
              >
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">Flight Preferences</span>
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
