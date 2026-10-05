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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Drone Projects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track and manage all industrial drone tenders posted by your organization.
          </p>
        </div>

        <Link
          href="/company/post-job"
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Project</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#0c142b] border border-slate-800">
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
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === tab.val
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#0c142b] border border-slate-800 animate-pulse h-32" />
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
              className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
                      {formatServiceType(job.serviceType)}
                    </span>
                    <StatusBadge status={job.status} type="job" />
                  </div>

                  <Link href={`/jobs/${job._id}`}>
                    <h3 className="text-base font-bold text-white hover:text-cyan-300 transition">
                      {job.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {job.location?.city}, {job.location?.state}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      Date: {formatDate(job.date)}
                    </span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Project Budget</span>
                  <span className="text-xl font-bold text-white">
                    {formatCurrency(job.budget)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  {job.assignedPilotId ? (
                    <span>Assigned Pilot: <strong className="text-cyan-300">{job.assignedPilotId.name}</strong></span>
                  ) : (
                    <span>Accepting verified pilot applications</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/company/applications?jobId=${job._id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>View Proposals</span>
                  </Link>

                  <Link
                    href={`/jobs/${job._id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Job Specs
                  </Link>

                  {job.status !== "COMPLETED" && job.status !== "CANCELLED" && (
                    <button
                      onClick={() => handleCancelJob(job._id)}
                      className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs"
                      title="Cancel Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
