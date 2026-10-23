"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Layers,
  MapPin,
  Calendar,
  DollarSign,
  PlusCircle,
  FileCheck2,
  ArrowRight,
  Trash2,
  CreditCard,
  Star,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default function CompanyMyJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const companyId = sessionData?.user?._id;

      if (companyId) {
        const res = await fetch(`/api/jobs?companyId=${companyId}&status=${statusFilter}`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      }
    } catch (err) {
      console.error("Failed to load company jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, [statusFilter]);

  const handleCancelJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to cancel this project tender?")) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) fetchCompanyJobs();
    } catch (err) {
      console.error("Cancel job error:", err);
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
              Commercial Tender Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            My Mission Projects
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Track and oversee all industrial drone tenders posted by your organization through every phase.
          </p>
        </div>

        <Button asChild variant="primary" size="sm" className="self-start sm:self-auto shrink-0 active:scale-[0.98]">
          <Link href="/company/post-job" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Post New Project</span>
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
        {[
          { label: "All Projects", val: "ALL" },
          { label: "Open & Bidding", val: "OPEN" },
          { label: "Pilot Assigned", val: "PILOT_SELECTED" },
          { label: "In Flight", val: "IN_PROGRESS" },
          { label: "Completed", val: "COMPLETED" },
          { label: "Cancelled", val: "CANCELLED" },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setStatusFilter(tab.val)}
            className={`px-3.5 py-1.5 rounded-control text-xs font-semibold transition-all ${
              statusFilter === tab.val
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-7 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 shadow-xs animate-pulse h-36" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Projects Found"
          description="You do not have any projects matching this status filter."
          actionText="Post a Project"
          actionHref="/company/post-job"
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 sm:p-7 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 shadow-xs space-y-5 hover:border-border-strong dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-control bg-primary/10 border border-primary/20 text-primary text-[11px] font-medium">
                      {formatServiceType(job.serviceType)}
                    </span>
                    <StatusBadge status={job.status} type="job" />
                  </div>

                  <Link href={`/jobs/${job._id}`}>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      {job.location?.city}, {job.location?.state}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      Flight Date: {formatDate(job.date)}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] text-muted-foreground block mb-0.5">Project Budget</span>
                  <span className="text-xl sm:text-2xl font-semibold text-foreground font-mono">
                    {formatCurrency(job.budget)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground font-medium">
                  {job.assignedPilotId ? (
                    <span>Assigned Pilot: <strong className="text-primary">{job.assignedPilotId.name}</strong></span>
                  ) : (
                    <span>Accepting verified pilot applications</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <Button asChild size="sm" variant="primary" className="w-full sm:w-auto active:scale-[0.98]">
                    <Link href={`/company/applications?jobId=${job._id}`} className="gap-1.5">
                      <FileCheck2 className="w-4 h-4" />
                      <span>View Proposals</span>
                    </Link>
                  </Button>

                  <Button variant="secondary" size="sm" asChild className="w-full sm:w-auto active:scale-[0.98]">
                    <Link href={`/jobs/${job._id}`}>
                      Job Specs
                    </Link>
                  </Button>

                  {job.status !== "COMPLETED" && job.status !== "CANCELLED" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelJob(job._id)}
                      title="Cancel Job"
                      className="active:scale-[0.98]"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      <span>Cancel</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}