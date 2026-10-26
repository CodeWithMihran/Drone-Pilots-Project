"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  Play,
  Star,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function PilotActiveJobsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "completed" ? "completed" : "active";

  const [tab, setTab] = useState<"active" | "completed">(initialTab);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAssignedJobs = async () => {
    try {
      setLoading(true);
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const pilotId = sessionData?.user?._id;

      if (pilotId) {
        const res = await fetch(`/api/jobs?pilotId=${pilotId}&status=ALL`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      }
    } catch (err) {
      console.error("Failed to fetch assigned jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedJobs();
  }, []);

  const handleStatusUpdate = async (jobId: string, newStatus: string) => {
    try {
      setUpdating(jobId);
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAssignedJobs();
      }
    } catch (err) {
      console.error("Update job status error:", err);
    } finally {
      setUpdating(null);
    }
  };

  const activeJobs = jobs.filter(
    (j) => j.status === "PILOT_SELECTED" || j.status === "IN_PROGRESS"
  );
  const completedJobs = jobs.filter((j) => j.status === "COMPLETED");

  const displayList = tab === "active" ? activeJobs : completedJobs;

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
              Contract Fulfillment Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Assigned Flight Missions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Track and advance contract milestones from takeoff clearance to final deliverable acceptance.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1.5 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setTab("active")}
            className={`px-3.5 py-1.5 rounded-control text-xs font-semibold transition-all flex items-center gap-1.5 ${
              tab === "active"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Missions ({activeJobs.length})</span>
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-3.5 py-1.5 rounded-control text-xs font-semibold transition-all flex items-center gap-1.5 ${
              tab === "completed"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed ({completedJobs.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-7 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 animate-pulse h-40" />
          ))}
        </div>
      ) : displayList.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={tab === "active" ? "No active flight contracts" : "No completed operations yet"}
          description={
            tab === "active"
              ? "You do not have assigned industrial operations in progress. Browse open missions to submit proposals."
              : "Completed missions and client ratings will be cataloged here."
          }
          actionText={tab === "active" ? "Browse Open Missions" : undefined}
          actionHref={tab === "active" ? "/pilot/jobs" : undefined}
        />
      ) : (
        <div className="space-y-4">
          {displayList.map((job) => (
            <div
              key={job._id}
              className="p-6 sm:p-7 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 hover:border-border-strong dark:hover:border-zinc-700 shadow-xs hover:-translate-y-0.5 transition-all duration-300 space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-medium text-primary px-2.5 py-0.5 rounded-control bg-primary/10 border border-primary/20">
                      {formatServiceType(job.serviceType)}
                    </span>
                    <StatusBadge status={job.status} type="job" />
                  </div>

                  <Link href={`/jobs/${job._id}`}>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-0.5">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <Building className="w-3.5 h-3.5 text-muted-foreground" />
                      Client: {job.companyId?.name || "Client"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {job.location?.city}, {job.location?.state}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      Flight Date: {formatDate(job.date)}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] font-medium text-muted-foreground block">Milestone Escrow</span>
                  <span className="text-xl sm:text-2xl font-semibold text-success font-mono">
                    {formatCurrency(job.budget)}
                  </span>
                </div>
              </div>

              {/* Status progression controls */}
              <div className="pt-4 border-t border-border dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {job.companyId?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {job.companyId.phone}
                    </span>
                  )}
                  {job.companyId?.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      {job.companyId.email}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  {job.status === "PILOT_SELECTED" && (
                    <Button
                      onClick={() => handleStatusUpdate(job._id, "IN_PROGRESS")}
                      disabled={updating === job._id}
                      variant="primary"
                      size="sm"
                      className="gap-1.5 active:scale-[0.98]"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Begin Mission Flight</span>
                    </Button>
                  )}

                  {job.status === "IN_PROGRESS" && (
                    <Button
                      onClick={() => handleStatusUpdate(job._id, "COMPLETED")}
                      disabled={updating === job._id}
                      variant="primary"
                      size="sm"
                      className="gap-1.5 bg-success text-white hover:bg-success/90 active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Mission Completed</span>
                    </Button>
                  )}

                  <Button asChild variant="secondary" size="sm" className="active:scale-[0.98]">
                    <Link href={`/jobs/${job._id}`} className="gap-1">
                      <span>Mission Room</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PilotActiveJobsPage() {
  return (
    <Suspense fallback={<div className="text-muted-foreground text-xs py-8 text-center">Loading active missions...</div>}>
      <PilotActiveJobsContent />
    </Suspense>
  );
}
