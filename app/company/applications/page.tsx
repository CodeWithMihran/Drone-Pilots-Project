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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pilot Proposals & Applications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare pilot match scores, certifications, hardware fleet, and select your flight operator.
          </p>
        </div>

        {/* Job Selector Dropdown */}
        {companyJobs.length > 0 && (
          <div className="w-full sm:w-72">
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c142b] border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
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
            <div key={i} className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800 animate-pulse h-44" />
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
                className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-xl space-y-4 hover:border-slate-700 transition"
              >
                {/* Header: Pilot Info + Match Score + Bid */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 shadow-md shrink-0">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-cyan-300 text-base">
                        {pilot?.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/pilots/${pilot?._id}`}>
                          <h3 className="text-base font-bold text-white hover:text-cyan-300 transition">
                            {pilot?.name || "Pilot"}
                          </h3>
                        </Link>
                        {app.isVerified ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            ✓ VERIFIED PILOT
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400">
                            Unverified
                          </span>
                        )}
                        <StatusBadge status={app.status} type="application" />
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <StarRating rating={profile?.rating || 5.0} totalReviews={profile?.totalReviews || 0} size="sm" />
                        <span>•</span>
                        <span>{profile?.experience || 1}+ Years Commercial Exp</span>
                        <span>•</span>
                        <span>{pilot?.location?.city}, {pilot?.location?.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Proposed Bid</span>
                      <span className="text-xl font-bold text-emerald-400">
                        {formatCurrency(app.bidAmount)}
                      </span>
                    </div>
                    {app.matchScore !== undefined && (
                      <MatchScoreBadge score={app.matchScore} size="md" />
                    )}
                  </div>
                </div>

                {/* Proposal Text */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                    <span>Flight Proposal & Methodology</span>
                    <span className="text-cyan-400">Availability: {app.availability}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line italic">
                    "{app.proposal}"
                  </p>
                </div>

                {/* Equipment Fleet Tags */}
                {profile?.equipment && profile.equipment.length > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 shrink-0 flex items-center gap-1">
                      <Plane className="w-3.5 h-3.5 text-cyan-400" />
                      Fleet:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.equipment.map((eq: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-cyan-300">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Decision Actions Bar */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">Submitted {formatDate(app.createdAt)}</span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/pilots/${pilot?._id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
                    >
                      View Full Profile
                    </Link>

                    {app.status === "PENDING" && (
                      <button
                        onClick={() => handleUpdateStatus(app._id, "SHORTLISTED")}
                        disabled={actionLoading === app._id}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-bold"
                      >
                        Shortlist
                      </button>
                    )}

                    {(app.status === "PENDING" || app.status === "SHORTLISTED") && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(app._id, "REJECTED")}
                          disabled={actionLoading === app._id}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 font-semibold"
                        >
                          Decline
                        </button>

                        <button
                          id={`accept-applicant-btn-${app._id}`}
                          onClick={() => handleUpdateStatus(app._id, "ACCEPTED")}
                          disabled={actionLoading === app._id}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-bold shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept & Assign Pilot</span>
                        </button>
                      </>
                    )}

                    {app.status === "ACCEPTED" && (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Assigned Pilot for this Project
                      </span>
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
    <Suspense fallback={<div className="p-6 text-slate-400 text-xs">Loading applications...</div>}>
      <CompanyApplicationsContent />
    </Suspense>
  );
}