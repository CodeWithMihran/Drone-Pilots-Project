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
  Zap,
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Pilot Proposals & Applications</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Compare pilot match scores, certifications, hardware fleet, and select your flight operator.
          </p>
        </div>

        {/* Job Selector Dropdown */}
        {companyJobs.length > 0 && (
          <div className="w-full sm:w-72">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="flex w-full h-11 rounded-control border border-border bg-background px-3.5 py-2 text-[15px] text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-colors hover:border-border-strong cursor-pointer"
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
            <div key={i} className="p-6 rounded-3xl bg-card border border-border shadow-sm animate-pulse h-44" />
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
                className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5 hover:border-border-strong transition-colors"
              >
                {/* Header: Pilot Info + Match Score + Bid */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary text-lg">
                        {pilot?.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link href={`/pilots/${pilot?._id}`}>
                          <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                            {pilot?.name || "Pilot"}
                          </h3>
                        </Link>
                        {app.isVerified ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            VERIFIED PILOT
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-secondary text-[11px] font-medium text-muted-foreground">
                            Unverified
                          </span>
                        )}
                        <StatusBadge status={app.status} type="application" />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <StarRating rating={profile?.rating || 5.0} totalReviews={profile?.totalReviews || 0} size="sm" />
                        <span className="hidden sm:inline">•</span>
                        <span>{profile?.experience || 1}+ Years Commercial Exp</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{pilot?.location?.city}, {pilot?.location?.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 bg-surface-2 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
                    <div className="text-left sm:text-right">
                      <span className="text-sm text-muted-foreground block mb-0.5">Proposed Bid</span>
                      <span className="text-2xl font-bold text-foreground">
                        {formatCurrency(app.bidAmount)}
                      </span>
                    </div>
                    {app.matchScore !== undefined && (
                      <MatchScoreBadge score={app.matchScore} size="md" />
                    )}
                  </div>
                </div>

                {/* Proposal Text */}
                <div className="p-5 rounded-2xl bg-secondary/40 border border-border text-sm space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground uppercase tracking-wider">Flight Proposal & Methodology</span>
                    <span className="text-primary bg-primary/10 px-2 py-1 rounded-md">Availability: {app.availability}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line text-foreground italic">
                    "{app.proposal}"
                  </p>
                </div>

                {/* Equipment Fleet Tags */}
                {profile?.equipment && profile.equipment.length > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground shrink-0 flex items-center gap-1.5 font-medium">
                      <Plane className="w-4 h-4 text-primary" />
                      Fleet:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {profile.equipment.map((eq: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-background border border-border text-xs text-foreground font-medium shadow-sm">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decision Actions Bar */}
                <div className="pt-5 mt-2 border-t border-border flex flex-wrap items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground font-medium">
                    Submitted {formatDate(app.createdAt)}
                  </span>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <Button variant="secondary" asChild className="w-full sm:w-auto">
                      <Link href={`/pilots/${pilot?._id}`}>
                        View Full Profile
                      </Link>
                    </Button>

                    {app.status === "PENDING" && (
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus(app._id, "SHORTLISTED")}
                        disabled={actionLoading === app._id}
                        className="w-full sm:w-auto"
                      >
                        Shortlist
                      </Button>
                    )}

                    {(app.status === "PENDING" || app.status === "SHORTLISTED") && (
                      <>
                        <Button
                          variant="destructive"
                          onClick={() => handleUpdateStatus(app._id, "REJECTED")}
                          disabled={actionLoading === app._id}
                          className="w-full sm:w-auto"
                        >
                          Decline
                        </Button>

                        <Button
                          id={`accept-applicant-btn-${app._id}`}
                          onClick={() => handleUpdateStatus(app._id, "ACCEPTED")}
                          disabled={actionLoading === app._id}
                          className="w-full sm:w-auto"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Accept & Assign Pilot
                        </Button>
                      </>
                    )}

                    {app.status === "ACCEPTED" && (
                      <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2 text-sm w-full sm:w-auto justify-center">
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