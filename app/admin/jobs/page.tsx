"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export default function AdminJobsManagementPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Admin fetch jobs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Flight Operations Audit</h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect all open tenders, assigned flight missions, and completed industrial contracts.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-3">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "All Projects", val: "ALL" },
            { label: "Open Tenders", val: "OPEN" },
            { label: "Bids Received", val: "APPLICATIONS_RECEIVED" },
            { label: "Pilot Assigned", val: "PILOT_SELECTED" },
            { label: "In Flight", val: "IN_PROGRESS" },
            { label: "Completed", val: "COMPLETED" },
            { label: "Cancelled", val: "CANCELLED" },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setStatusFilter(tab.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === tab.val
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              placeholder="Search by project title, city, or client name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={fetchJobs}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-md"
          >
            Search
          </button>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Projects Found"
            description="No jobs match your filter criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Job Title & Sector</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Assigned Pilot</th>
                  <th className="pb-3">Budget</th>
                  <th className="pb-3">Flight Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 pl-2 font-bold text-white">
                      <Link href={`/jobs/${j._id}`} className="hover:text-cyan-300">
                        {j.title}
                      </Link>
                      <span className="block text-[10px] text-cyan-400 font-normal">
                        {formatServiceType(j.serviceType)} • {j.location?.city}, {j.location?.state}
                      </span>
                    </td>

                    <td className="py-3.5 text-slate-300">
                      {j.companyId?.name || "Client"}
                    </td>

                    <td className="py-3.5 text-slate-300">
                      {j.assignedPilotId ? (
                        <span className="text-emerald-300 font-medium">{j.assignedPilotId.name}</span>
                      ) : (
                        <span className="text-slate-500">Unassigned ({j.applicationsCount || 0} bids)</span>
                      )}
                    </td>

                    <td className="py-3.5 font-bold text-white">
                      {formatCurrency(j.budget)}
                    </td>

                    <td className="py-3.5 text-slate-400">
                      {formatDate(j.date)}
                    </td>

                    <td className="py-3.5">
                      <StatusBadge status={j.status} type="job" />
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      <Link
                        href={`/jobs/${j._id}`}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-[11px]"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
