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
    <div className="space-y-6 max-w-5xl">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          My Mission Proposals
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review the compliance scoring, bidding status, and hiring outcomes of your submitted proposals.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-panel bg-surface border border-border animate-pulse h-32" />
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
              <Card key={app._id}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[11px]">
                          {formatServiceType(job.serviceType)}
                        </Badge>
                        <StatusBadge status={app.status} type="application" />
                        {app.matchScore !== undefined && (
                          <MatchScoreBadge score={app.matchScore} size="sm" />
                        )}
                      </div>
                      <Link href={`/jobs/${job._id}`}>
                        <h3 className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                        <span>Client: {job.companyId?.name || "Client"}</span>
                        <span>•</span>
                        <span>Location: {job.location?.city}, {job.location?.state}</span>
                        <span>•</span>
                        <span>Flight Date: {formatDate(job.date)}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] font-medium text-muted-foreground block">Your Bid</span>
                      <span className="text-xl font-bold text-success font-mono">
                        {formatCurrency(app.bidAmount)}
                      </span>
                      <span className="text-[10px] text-subtle block">
                        (Client Budget: {formatCurrency(job.budget)})
                      </span>
                    </div>
                  </div>

                  {/* Proposal excerpt */}
                  <div className="p-3.5 rounded-control bg-surface-2 border border-border text-xs text-foreground">
                    <p className="font-semibold text-muted-foreground text-[11px] mb-1">Your Proposal Brief:</p>
                    <p className="line-clamp-2 italic leading-relaxed">{app.proposal}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-subtle">
                    <span>Submitted on {formatDate(app.createdAt)}</span>
                    <div className="flex items-center gap-2">
                      {app.status === "PENDING" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleWithdraw(app._id)}
                          className="text-destructive hover:bg-destructive/10 text-xs h-8"
                        >
                          Withdraw Bid
                        </Button>
                      )}
                      <Button asChild variant="secondary" size="sm" className="h-8">
                        <Link href={`/jobs/${job._id}`} className="gap-1">
                          <span>View Project</span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
