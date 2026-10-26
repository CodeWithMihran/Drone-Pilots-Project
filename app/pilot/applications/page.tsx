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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Tender Proposals Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            My Mission Proposals
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Review the compliance scoring, bidding status, and hiring outcomes of your submitted commercial proposals.
          </p>
        </div>

        <Button asChild variant="primary" size="sm" className="shrink-0 active:scale-[0.98]">
          <Link href="/pilot/jobs">Browse Open Tenders</Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-7 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 animate-pulse h-36" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No proposals submitted yet"
          description="You have not submitted proposals for any commercial projects. Browse available missions to place bids."
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
                className="p-6 sm:p-7 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 hover:border-border-strong dark:hover:border-zinc-700 shadow-xs hover:-translate-y-0.5 transition-all duration-300 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-medium text-primary px-2.5 py-0.5 rounded-control bg-primary/10 border border-primary/20">
                        {formatServiceType(job.serviceType)}
                      </span>
                      <StatusBadge status={app.status} type="application" />
                      {app.matchScore !== undefined && (
                        <MatchScoreBadge score={app.matchScore} size="sm" />
                      )}
                    </div>
                    <Link href={`/jobs/${job._id}`}>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                      <span>Client: <strong className="text-foreground font-medium">{job.companyId?.name || "Client"}</strong></span>
                      <span>•</span>
                      <span>Location: {job.location?.city}, {job.location?.state}</span>
                      <span>•</span>
                      <span>Flight Date: {formatDate(job.date)}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] font-medium text-muted-foreground block">Your Proposed Bid</span>
                    <span className="text-xl sm:text-2xl font-semibold text-success font-mono">
                      {formatCurrency(app.bidAmount)}
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      Client Budget: {formatCurrency(job.budget)}
                    </span>
                  </div>
                </div>

                {/* Proposal excerpt */}
                <div className="p-4 rounded-control bg-surface-2 dark:bg-zinc-900/50 border border-border dark:border-zinc-800 text-xs text-foreground space-y-1">
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Your Proposal Brief</p>
                  <p className="line-clamp-2 italic leading-relaxed text-muted-foreground">"{app.proposal}"</p>
                </div>

                <div className="pt-3 border-t border-border dark:border-zinc-800/80 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Submitted on {formatDate(app.createdAt)}</span>
                  <div className="flex items-center gap-2.5">
                    {app.status === "PENDING" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWithdraw(app._id)}
                        className="text-destructive hover:bg-destructive/10 text-xs h-8 active:scale-[0.98]"
                      >
                        Withdraw Bid
                      </Button>
                    )}
                    <Button asChild variant="secondary" size="sm" className="h-8 active:scale-[0.98]">
                      <Link href={`/jobs/${job._id}`} className="gap-1.5">
                        <span>View Project Room</span>
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
