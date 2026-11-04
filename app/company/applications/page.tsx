"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileCheck2,
  User,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ChevronRight,
  Plane,
  Building,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { StarRating } from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";

function CompanyApplicationsContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";

  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 1. Fetch company's jobs to populate the dropdown
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

            // Default to the first job if none specified in URL
            if (!initialJobId && jobs.length > 0) {
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
      <div className="rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              PROPOSAL REVIEW
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Pilot Proposals & Bids
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Compare pilot match scores, Part 107 certifications, sensor payloads, and award contract tenders.
          </p>
        </div>

        {/* Job Selector Dropdown */}
        {companyJobs.length > 0 && (
          <div className="w-full sm:w-80 shrink-0">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Select Mission Brief
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="flex w-full h-11 rounded-full border border-border dark:border-zinc-800 bg-surface dark:bg-zinc-900 px-4 py-2 text-xs font-semibold text-foreground shadow-xs focus-visible:outline-none focus:border-[#fabf28] transition-colors cursor-pointer"
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
            <div key={i} className="p-7 rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 shadow-xs animate-pulse h-44" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No Proposals Received for this Mission"
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
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 shadow-xs space-y-5 hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200"
              >
                {/* Header: Pilot Info + Match Score + Bid */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-950 dark:bg-zinc-850 text-[#fabf28] flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
                      {pilot?.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link href={`/pilots/${pilot?._id}`}>
                          <h3 className="text-base sm:text-xl font-bold text-foreground hover:text-[#fabf28] transition-colors">
                            {pilot?.name || "Pilot"}
                          </h3>
                        </Link>
                        {app.isVerified ? (
                          <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            PART 107 VERIFIED
                          </span>
                        ) : (
                          <span className="px-3 py-0.5 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800 text-[11px] font-semibold text-muted-foreground">
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

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 shrink-0 bg-[#faf8f5] dark:bg-zinc-900/60 sm:bg-transparent p-4 sm:p-0 rounded-2xl border border-border/40 sm:border-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-0.5">Proposed Price</span>
                      <span className="text-xl sm:text-2xl font-extrabold text-foreground font-sans">
                        {formatCurrency(app.bidAmount)}
                      </span>
                    </div>
                    {app.matchScore !== undefined && (
                      <MatchScoreBadge score={app.matchScore} size="md" />
                    )}
                  </div>
                </div>

                {/* Proposal Text */}
                <div className="p-5 rounded-2xl bg-[#faf8f5]/80 dark:bg-zinc-900/50 border border-border/80 dark:border-zinc-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-muted-foreground uppercase font-mono tracking-wider">Flight Proposal & Methodology</span>
                    <span className="text-zinc-950 dark:text-white bg-[#fabf28] px-2.5 py-0.5 rounded-full text-[10px]">Availability: {app.availability}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line text-foreground italic">
                    &ldquo;{app.proposal}&rdquo;
                  </p>
                </div>

                {/* Equipment Fleet Tags */}
                {profile?.equipment && profile.equipment.length > 0 && (
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground shrink-0 flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase">
                      <Plane className="w-3.5 h-3.5 text-[#fabf28]" />
                      Fleet:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.equipment.map((eq: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800 text-[11px] text-foreground font-semibold">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decision Actions Bar */}
                <div className="pt-4 border-t border-border/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground font-medium">
                    Submitted on {formatDate(app.createdAt)}
                  </span>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <Button variant="secondary" size="sm" asChild className="rounded-full px-4 h-9 border border-border dark:border-zinc-800 text-xs font-semibold w-full sm:w-auto active:scale-[0.98]">
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
                        className="rounded-full px-4 h-9 text-xs font-semibold w-full sm:w-auto active:scale-[0.98]"
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
                          className="rounded-full px-4 h-9 text-xs font-semibold w-full sm:w-auto active:scale-[0.98]"
                        >
                          Decline
                        </Button>

                        <Button
                          id={`accept-applicant-btn-${app._id}`}
                          size="sm"
                          onClick={() => handleUpdateStatus(app._id, "ACCEPTED")}
                          disabled={actionLoading === app._id}
                          className="rounded-full px-6 h-9 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs w-full sm:w-auto active:scale-[0.98]"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          Accept & Assign Pilot
                        </Button>
                      </>
                    )}

                    {app.status === "ACCEPTED" && (
                      <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 text-xs w-full sm:w-auto justify-center">
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
