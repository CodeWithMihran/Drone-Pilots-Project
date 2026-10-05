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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Assigned Flight Missions</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your active operations, flight deliverables, and mission completion logs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              tab === "active"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Active Missions ({activeJobs.length})</span>
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              tab === "completed"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed Missions ({completedJobs.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#0c142b] border border-slate-800 animate-pulse h-36" />
          ))}
        </div>
      ) : displayList.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={tab === "active" ? "No Active Missions" : "No Completed Missions Yet"}
          description={
            tab === "active"
              ? "You do not currently have assigned flight contracts in progress. Browse jobs to submit proposals."
              : "Completed missions and client reviews will be archived here."
          }
          actionText={tab === "active" ? "Browse Open Jobs" : undefined}
          actionHref={tab === "active" ? "/pilot/jobs" : undefined}
        />
      ) : (
        <div className="space-y-4">
          {displayList.map((job) => (
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
                    <h3 className="text-lg font-bold text-white hover:text-cyan-300 transition">
                      {job.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Building className="w-3.5 h-3.5 text-cyan-400" />
                      Client: {job.companyId?.name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {job.location?.city}, {job.location?.state}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      Flight Date: {formatDate(job.date)}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Milestone Payout</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {formatCurrency(job.budget)}
                  </span>
                </div>
              </div>

              {/* Status progression controls */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {job.companyId?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      {job.companyId.phone}
                    </span>
                  )}
                  {job.companyId?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-teal-400" />
                      {job.companyId.email}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {job.status === "PILOT_SELECTED" && (
                    <button
                      onClick={() => handleStatusUpdate(job._id, "IN_PROGRESS")}
                      disabled={updating === job._id}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Mission (In Progress)</span>
                    </button>
                  )}

                  {job.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => handleStatusUpdate(job._id, "COMPLETED")}
                      disabled={updating === job._id}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Mission Completed</span>
                    </button>
                  )}

                  <Link
                    href={`/jobs/${job._id}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition flex items-center gap-1"
                  >
                    <span>Mission Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
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
    <Suspense fallback={<div className="text-white text-xs">Loading active missions...</div>}>
      <PilotActiveJobsContent />
    </Suspense>
  );
}
