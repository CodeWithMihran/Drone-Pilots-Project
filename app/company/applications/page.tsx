"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileCheck2,
  ShieldCheck,
  Star,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  User,
  Plane,
  Award,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StarRating } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

function CompanyApplicationsContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";

  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 1. Fetch company's jobs for the dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const companyId = sessionData?.user?._id;

        if (companyId) {
          const res = await fetch(`/api/jobs?companyId=${companyId}&status=ALL`);
          if (res.ok) {
            const data = await res.json();
            const jobs = data.jobs || [];
            setCompanyJobs(jobs);
            if (!selectedJobId && jobs.length > 0) {
              setSelectedJobId(jobs[0]._id);
            }
          }
        }
      } catch (err) {
        console.error("Fetch company jobs error:", err);
      }
    };

    fetchJobs();
  }, []);

  // 2. Fetch applications for the selected job
  const fetchApplications = async () => {
    if (!selectedJobId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/jobs/${selectedJobId}/applications`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error("Fetch applications error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedJobId]);

  const handleUpdateStatus = async (appId: string, status: string) => {
    try {
      setActionLoading(appId);
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (err) {
      console.error("Update status error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Candidate Evaluation & Proposals
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Pilot Proposals & Flight Bids
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Compare pilot match scores, Part 107 certifications, sensor payloads, and award contract tenders.
          </p>
        </div>

        {/* Job Selector Dropdown */}
        {companyJobs.length > 0 && (
          <div className="w-full sm:w-80 shrink-0">
            <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block mb-1.5">
              Select Mission Tender
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="flex w-full h-10 rounded-control border border-border dark:border-zinc-800 bg-surface-2 dark:bg-zinc-900 px-3.5 py-1.5 text-xs text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors hover:border-border-strong cursor-pointer"
            >
              {companyJobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title} ({j.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-7 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 shadow-xs animate-pulse h-44" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No Proposals Received for this Project"
          description="Verified pilots browsing your project will appear here once they submit bids."
        />
      ) : (
        <div className="space-y-5">
          {applications.map((app) => {
            const pilot = app.pilotId;
            const profile = app.pilotProfile;

            return (
              <div
                key={app._id}
                className="p-6 sm:p-7 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 shadow-xs space-y-5 hover:border-border-strong dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Header: Pilot Info + Match Score + Bid */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-control bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                      <span className="font-bold text-lg">
                        {pilot?.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link href={`/pilots/${pilot?._id}`}>
                          <h3 className="text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors">
                            {pilot?.name || "Pilot"}
                          </h3>
                        </Link>
                        {app.isVerified ? (
                          <span className="px-2.5 py-0.5 rounded-control bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            PART 107 VERIFIED
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-[11px] font-medium text-muted-foreground">
                            Standard
                          </span>
                        )}
                        <StatusBadge status={app.status} type="application" />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <StarRating rating={profile?.rating || 5.0} totalReviews={profile?.totalReviews || 0} size="sm" />
                        <span className="hidden sm:inline">•</span>
                        <span>{profile?.experience || 1}+ Years Commercial Exp</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{pilot?.location?.city}, {pilot?.location?.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 shrink-0 bg-surface-2 dark:bg-zinc-900/60 sm:bg-transparent p-3.5 sm:p-0 rounded-control border border-border/40 sm:border-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-muted-foreground block mb-0.5">Proposed Bid</span>
                      <span className="text-xl sm:text-2xl font-semibold text-foreground font-mono">
                        {formatCurrency(app.bidAmount)}
                      </span>
                    </div>
                    {app.matchScore !== undefined && (
                      <MatchScoreBadge score={app.matchScore} size="md" />
                    )}
                  </div>
                </div>

                {/* Proposal Text */}
                <div className="p-4 rounded-control bg-surface-2 dark:bg-zinc-900/50 border border-border dark:border-zinc-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-muted-foreground uppercase tracking-wider">Flight Proposal & Methodology</span>
                    <span className="text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-control">Availability: {app.availability}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line text-foreground italic">
                    "{app.proposal}"
                  </p>
                </div>

                {/* Equipment Fleet Tags */}
                {profile?.equipment && profile.equipment.length > 0 && (
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground shrink-0 flex items-center gap-1.5 font-medium">
                      <Plane className="w-3.5 h-3.5 text-primary" />
                      Fleet:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.equipment.map((eq: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-[11px] text-muted-foreground font-medium">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decision Actions Bar */}
                <div className="pt-4 border-t border-border dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground font-medium">
                    Submitted on {formatDate(app.createdAt)}
                  </span>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <Button variant="secondary" size="sm" asChild className="w-full sm:w-auto active:scale-[0.98]">
                      <Link href={`/pilots/${pilot?._id}`}>
                        View Pilot Profile
                      </Link>
                    </Button>

                    {app.status === "PENDING" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(app._id, "SHORTLISTED")}
                        disabled={actionLoading === app._id}
                        className="w-full sm:w-auto active:scale-[0.98]"
                      >
                        Shortlist
                      </Button>
                    )}

                    {(app.status === "PENDING" || app.status === "SHORTLISTED") && (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleUpdateStatus(app._id, "REJECTED")}
                          disabled={actionLoading === app._id}
                          className="w-full sm:w-auto active:scale-[0.98]"
                        >
                          Decline
                        </Button>

                        <Button
                          id={`accept-applicant-btn-${app._id}`}
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateStatus(app._id, "ACCEPTED")}
                          disabled={actionLoading === app._id}
                          className="w-full sm:w-auto active:scale-[0.98]"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Accept & Assign Pilot
                        </Button>
                      </>
                    )}

                    {app.status === "ACCEPTED" && (
                      <div className="px-3.5 py-1.5 rounded-control bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 text-xs w-full sm:w-auto justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                        Assigned Pilot for this Project
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CompanyApplicationsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground text-sm">Loading applications...</div>}>
      <CompanyApplicationsContent />
    </Suspense>
  );
}