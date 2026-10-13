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
  Radio,
  SlidersHorizontal,
  Compass,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* BENTO ROW 1: Flight Readiness Hero & Financial Overview */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bento Tile 1: Pilot Status & Mission Readiness (Span 2) */}
        <div className="lg:col-span-2 rounded-panel bg-surface border border-border p-6 sm:p-7 flex flex-col justify-between shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-success"></span>
                <span className="text-[11px] font-medium tracking-wide uppercase text-muted-foreground">
                  Flight Operations Console
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
                Welcome back, {pilotName}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                Review your active field assignments, open enterprise mission tenders, and verified Part 107 credential status.
              </p>
            </div>

            {/* Credential Badge */}
            <div className="shrink-0">
              {stats.isVerified ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-control bg-success/10 border border-success/20 text-success text-xs font-medium">
                  <BadgeCheck className="w-4 h-4 text-success" />
                  <span>FAA Part 107 Verified</span>
                </div>
              ) : (
                <Link
                  href="/pilot/certification"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-control bg-warning/10 border border-warning/20 text-warning text-xs font-medium hover:bg-warning/15 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <span>Verification Pending</span>
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Profile completion bar */}
            <div className="flex-1 max-w-sm space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Operational Profile</span>
                <span className="text-foreground font-semibold">{stats.profileCompletion}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden border border-border/50">
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${stats.profileCompletion}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button asChild size="sm" variant="primary">
                <Link href="/pilot/jobs" className="gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Find Missions</span>
                </Link>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <Link href="/pilot/profile" className="gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bento Tile 2: Escrow Earnings & Financial Settlement (Span 1) */}
        <div className="rounded-panel bg-surface border border-border p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Escrow Earnings
              </span>
              <div className="w-7 h-7 rounded-control bg-surface-2 border border-border flex items-center justify-center text-muted-foreground">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-semibold tracking-tight text-foreground">
                {formatCurrency(stats.totalEarnings)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total disbursed from completed operations
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Direct Bank Payout</span>
            <Link
              href="/pilot/earnings"
              className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View ledger</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BENTO ROW 2: Core Operational Metric Cards */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Available Missions */}
        <div className="rounded-panel bg-surface border border-border p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Open Missions</span>
            <Compass className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-foreground tracking-tight">
              {stats.availableJobs}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Accepting pilot bids</p>
          </div>
        </div>

        {/* Metric 2: Applications / Bids Submitted */}
        <div className="rounded-panel bg-surface border border-border p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Submitted Bids</span>
            <FileCheck2 className="w-4 h-4 text-primary" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-foreground tracking-tight">
              {stats.applicationsCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Active proposals in review</p>
          </div>
        </div>

        {/* Metric 3: Active Field Operations */}
        <div className="rounded-panel bg-surface border border-border p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Active Flights</span>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-foreground tracking-tight">
              {stats.activeJobsCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {stats.activeJobsCount > 0 ? "Operations underway" : "Ready for deployment"}
            </p>
          </div>
        </div>

        {/* Metric 4: Flight Quality & Rating */}
        <div className="rounded-panel bg-surface border border-border p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Client Rating</span>
            <Star className="w-4 h-4 text-warning fill-warning" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-semibold text-foreground tracking-tight flex items-center gap-1.5">
              <span>{stats.rating.toFixed(1)}</span>
              <span className="text-xs font-normal text-muted-foreground">/ 5.0</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">{stats.totalReviews} verified reviews</p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BENTO ROW 3: Active Assignments (Conditional) */}
      {/* ============================================================ */}
      {activeProjects.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-warning animate-pulse"></span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Active Mission Deployments
              </h2>
            </div>
            <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
              <Link href="/pilot/active-jobs">
                View all active ({activeProjects.length}) <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.map((proj) => (
              <div
                key={proj._id}
                className="p-5 rounded-panel bg-surface border border-border shadow-xs flex flex-col justify-between hover:border-border-strong transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2.5">
                    <span className="text-[11px] font-medium text-primary px-2 py-0.5 rounded-control bg-primary/10">
                      {formatServiceType(proj.serviceType)}
                    </span>
                    <StatusBadge status={proj.status} type="job" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{proj.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span>Client: <strong className="font-medium text-foreground">{proj.companyId?.name || "Enterprise"}</strong></span>
                    {proj.location?.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {proj.location.city}, {proj.location.state}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block">Mission Escrow</span>
                    <span className="text-sm font-semibold text-foreground">{formatCurrency(proj.budget)}</span>
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/jobs/${proj._id}`}>Manage Operation</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* BENTO ROW 4: Matching Mission Postings & Operational Checklist */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2): Curated Matching Missions */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                Matching Mission Postings
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Qualified tenders matching your Part 107 flight authorizations and equipment payload profile.
              </p>
            </div>
            <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs hidden sm:inline-flex">
              <Link href="/pilot/jobs">
                Browse catalog <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          {matchingJobs.length === 0 ? (
            <div className="rounded-panel bg-surface border border-border p-8">
              <EmptyState
                icon={Briefcase}
                title="No Open Tenders Currently"
                description="All current mission tenders have been filled. New enterprise flight tenders are published regularly."
                actionText="Explore All Jobs"
                actionHref="/pilot/jobs"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {matchingJobs.map((job) => (
                <div
                  key={job._id}
                  className="p-5 rounded-panel bg-surface border border-border hover:border-border-strong shadow-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-medium text-primary px-2 py-0.5 rounded-control bg-primary/10">
                        {formatServiceType(job.serviceType)}
                      </span>
                      {job.matchScore !== undefined && (
                        <MatchScoreBadge score={job.matchScore} size="sm" />
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location?.city || "Field Site"}, {job.location?.state || ""}
                      </span>
                    </div>

                    <Link href={`/jobs/${job._id}`}>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-foreground block">
                        {formatCurrency(job.budget)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Escrow Secured</span>
                    </div>

                    <Button asChild size="sm" variant="secondary" className="group-hover:border-primary/40">
                      <Link href={`/jobs/${job._id}`}>
                        Apply <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Span 1): Operational Readiness & Checklist */}
        <div className="space-y-4">
          <div className="rounded-panel bg-surface border border-border p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Flight Compliance Status
              </h3>
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-3 divide-y divide-border text-xs">
              <div className="pt-2 first:pt-0 flex items-center justify-between">
                <span className="text-muted-foreground">FAA Part 107 Airman</span>
                {stats.isVerified ? (
                  <span className="font-medium text-success flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Validated
                  </span>
                ) : (
                  <span className="font-medium text-warning flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Action Required
                  </span>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-muted-foreground">COI Insurance</span>
                <span className="font-medium text-foreground">Verified Policy</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Airframe Registration</span>
                <span className="font-medium text-foreground">On File</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-muted-foreground">Safety Record</span>
                <span className="font-medium text-success">Zero Incidents</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <Button asChild variant="secondary" size="sm" className="w-full text-xs">
                <Link href="/pilot/certification">
                  Update Certifications & COI
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="rounded-panel bg-surface border border-border p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Pilot Quick Actions
            </h3>

            <div className="space-y-1.5">
              <Link
                href="/pilot/applications"
                className="flex items-center justify-between p-2.5 rounded-control text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors border border-transparent hover:border-border"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Submitted Proposals</span>
                </div>
                <span className="font-semibold text-foreground">{stats.applicationsCount}</span>
              </Link>

              <Link
                href="/pilot/reviews"
                className="flex items-center justify-between p-2.5 rounded-control text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors border border-transparent hover:border-border"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-warning" />
                  <span>Client Ratings</span>
                </div>
                <span className="font-semibold text-foreground">{stats.totalReviews}</span>
              </Link>

              <Link
                href="/pilot/settings"
                className="flex items-center justify-between p-2.5 rounded-control text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors border border-transparent hover:border-border"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Flight Preferences</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}