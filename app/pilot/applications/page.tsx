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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Flight Applications</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review the status of your submitted flight proposals and bids.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#0c142b] border border-slate-800 animate-pulse h-32" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileCheck2}
          title="No Applications Submitted"
          description="You have not submitted proposals for any commercial projects yet. Browse available contracts to get started."
          actionText="Find Drone Jobs"
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
                className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
                        {formatServiceType(job.serviceType)}
                      </span>
                      <StatusBadge status={app.status} type="application" />
                      {app.matchScore !== undefined && (
                        <MatchScoreBadge score={app.matchScore} size="sm" />
                      )}
                    </div>
                    <Link href={`/jobs/${job._id}`}>
                      <h3 className="text-base font-bold text-white hover:text-cyan-300 transition">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>Client: {job.companyId?.name || "Client"}</span>
                      <span>•</span>
                      <span>Location: {job.location?.city}, {job.location?.state}</span>
                      <span>•</span>
                      <span>Flight: {formatDate(job.date)}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Your Bid</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {formatCurrency(app.bidAmount)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      (Project Budget: {formatCurrency(job.budget)})
                    </span>
                  </div>
                </div>

                {/* Proposal excerpt */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <p className="font-semibold text-slate-400 text-[11px] mb-1">Your Proposal:</p>
                  <p className="line-clamp-2 italic">{app.proposal}</p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Applied on {formatDate(app.createdAt)}</span>
                  <div className="flex items-center gap-2">
                    {app.status === "PENDING" && (
                      <button
                        onClick={() => handleWithdraw(app._id)}
                        className="text-rose-400 hover:underline text-xs"
                      >
                        Withdraw Bid
                      </button>
                    )}
                    <Link
                      href={`/jobs/${job._id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs flex items-center gap-1"
                    >
                      <span>View Project</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
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
