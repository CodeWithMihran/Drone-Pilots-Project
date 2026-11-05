"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck2,
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  Clock,
  Briefcase,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default function PilotApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/applications/my");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "WITHDRAWN" }),
      });
      if (res.ok) fetchApplications();
    } catch (err) {
      console.error("Withdraw error:", err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              PROPOSALS PIPELINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            My Submitted Proposals
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Track client hiring decisions, match scores, and project room discussions for your active pitches.
          </p>
        </div>

        <Button asChild className="h-10 px-6 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs shrink-0 active:scale-[0.98]">
          <Link href="/pilot/jobs">Find New Missions</Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-7 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 animate-pulse h-36" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No proposals submitted yet"
          description="You haven't pitched on any open briefs yet. Browse available client missions to submit your first proposal."
          actionText="Browse Open Missions"
          actionHref="/pilot/jobs"
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const job = app.jobId;
            if (!job) return null;

            return (
              <div
                key={app._id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs hover:shadow-md transition-all duration-200 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-zinc-900 dark:text-white px-2.5 py-0.5 rounded-full bg-[#fabf28]/20 border border-[#fabf28]/30">
                        {formatServiceType(job.serviceType)}
                      </span>
                      <StatusBadge status={app.status} type="application" />
                      {app.matchScore !== undefined && (
                        <MatchScoreBadge score={app.matchScore} size="sm" />
                      )}
                    </div>
                    <Link href={`/jobs/${job._id}`}>
                      <h3 className="text-base sm:text-xl font-bold text-foreground hover:text-[#fabf28] transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                      <span>Client: <strong className="text-foreground font-semibold">{job.companyId?.name || "Client"}</strong></span>
                      <span>•</span>
                      <span>Location: {job.location?.city}, {job.location?.state}</span>
                      <span>•</span>
                      <span>Flight Date: {formatDate(job.date)}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block">Your Proposed Price</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-foreground font-sans">
                      {formatCurrency(app.bidAmount)}
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      Client Budget: {formatCurrency(job.budget)}
                    </span>
                  </div>
                </div>

                {/* Proposal excerpt */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-border/80 dark:border-zinc-800 text-xs text-foreground space-y-1">
                  <p className="font-mono font-bold text-muted-foreground uppercase tracking-wider text-[10px]">Your Proposal Pitch</p>
                  <p className="line-clamp-2 italic leading-relaxed text-muted-foreground">&ldquo;{app.proposal}&rdquo;</p>
                </div>

                <div className="pt-3 border-t border-border/80 dark:border-zinc-800/80 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Submitted on {formatDate(app.createdAt)}</span>
                  <div className="flex items-center gap-2.5">
                    {app.status === "PENDING" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWithdraw(app._id)}
                        className="rounded-full text-rose-500 hover:bg-rose-500/10 text-xs h-9 active:scale-[0.98]"
                      >
                        Withdraw Bid
                      </Button>
                    )}
                    <Button asChild variant="secondary" size="sm" className="rounded-full px-5 h-9 active:scale-[0.98] border border-border dark:border-zinc-800 text-xs font-semibold">
                      <Link href={`/jobs/${job._id}`} className="gap-1.5">
                        <span>Project Room</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    </Button>
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
