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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">My Drone Projects</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Track and manage all industrial drone tenders posted by your organization.
          </p>
        </div>

        <Button asChild size="lg" className="self-start sm:self-auto">
          <Link href="/company/post-job">
            <PlusCircle className="w-4 h-4 mr-2" />
            Post New Project
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-secondary/50 border border-border">
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
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              statusFilter === tab.val
                ? "bg-background text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50 border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm animate-pulse h-32" />
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
        <div className="space-y-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5 hover:border-border-strong transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider">
                      {formatServiceType(job.serviceType)}
                    </span>
                    <StatusBadge status={job.status} type="job" />
                  </div>

                  <Link href={`/jobs/${job._id}`}>
                    <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-4 h-4 text-primary" />
                      {job.location?.city}, {job.location?.state}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-primary" />
                      Date: {formatDate(job.date)}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right bg-surface-2 sm:bg-transparent p-4 sm:p-0 rounded-2xl shrink-0">
                  <span className="text-sm text-muted-foreground block mb-0.5">Project Budget</span>
                  <span className="text-2xl font-bold text-foreground">
                    {formatCurrency(job.budget)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground font-medium">
                  {job.assignedPilotId ? (
                    <span>Assigned Pilot: <strong className="text-primary">{job.assignedPilotId.name}</strong></span>
                  ) : (
                    <span>Accepting verified pilot applications</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/company/applications?jobId=${job._id}`}>
                      <FileCheck2 className="w-4 h-4 mr-2" />
                      View Proposals
                    </Link>
                  </Button>

                  <Button variant="secondary" asChild className="w-full sm:w-auto">
                    <Link href={`/jobs/${job._id}`}>
                      Job Specs
                    </Link>
                  </Button>

                  {job.status !== "COMPLETED" && job.status !== "CANCELLED" && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleCancelJob(job._id)}
                      title="Cancel Job"
                      className="hidden sm:flex"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  {/* Mobile Cancel Button */}
                  {job.status !== "COMPLETED" && job.status !== "CANCELLED" && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelJob(job._id)}
                      className="w-full sm:hidden"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Cancel Job
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