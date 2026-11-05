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
  ArrowUpRight,
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
    if (!confirm("Are you sure you want to cancel this mission brief?")) return;
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
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              MISSION MANAGEMENT
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            My Mission Briefs
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Track and oversee all commercial drone shoots posted by your company across every milestone.
          </p>
        </div>

        <Button asChild className="h-10 px-6 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs self-start sm:self-auto shrink-0 active:scale-[0.98]">
          <Link href="/company/post-job" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Post a Mission</span>
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
        {[
          { label: "All Missions", val: "ALL" },
          { label: "Open & Bidding", val: "OPEN" },
          { label: "Pilot Assigned", val: "PILOT_SELECTED" },
          { label: "In Flight", val: "IN_PROGRESS" },
          { label: "Completed", val: "COMPLETED" },
          { label: "Cancelled", val: "CANCELLED" },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setStatusFilter(tab.val)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              statusFilter === tab.val
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
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
            <div key={i} className="p-7 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs animate-pulse h-36" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Missions Found"
          description="You do not have any mission briefs matching this filter."
          actionText="Post a Mission"
          actionHref="/company/post-job"
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs space-y-5 hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#fabf28]/15 border border-[#fabf28]/25 text-zinc-950 dark:text-[#fabf28] text-[11px] font-bold">
                      {formatServiceType(job.serviceType)}
                    </span>
                    <StatusBadge status={job.status} type="job" />
                  </div>

                  <Link href={`/jobs/${job._id}`}>
                    <h3 className="text-base sm:text-xl font-bold text-foreground hover:text-[#fabf28] transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#fabf28]" />
                      {job.location?.city}, {job.location?.state}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      Shoot Date: {formatDate(job.date)}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-0.5">Budget</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-foreground font-sans">
                    {formatCurrency(job.budget)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-muted-foreground font-medium">
                  {job.assignedPilotId ? (
                    <span>Assigned Pilot: <strong className="text-foreground font-semibold">{job.assignedPilotId.name}</strong></span>
                  ) : (
                    <span>Accepting verified pilot proposals</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <Button asChild size="sm" className="rounded-full px-5 h-9 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs w-full sm:w-auto active:scale-[0.98]">
                    <Link href={`/company/applications?jobId=${job._id}`} className="gap-1.5">
                      <FileCheck2 className="w-4 h-4" />
                      <span>View Proposals</span>
                    </Link>
                  </Button>

                  <Button variant="secondary" size="sm" asChild className="rounded-full px-4 h-9 border border-border dark:border-zinc-800 text-xs font-semibold w-full sm:w-auto active:scale-[0.98]">
                    <Link href={`/jobs/${job._id}`}>
                      Brief Specs
                    </Link>
                  </Button>

                  {job.status !== "COMPLETED" && job.status !== "CANCELLED" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelJob(job._id)}
                      title="Cancel Job"
                      className="rounded-full px-4 h-9 text-xs active:scale-[0.98]"
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
