"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Briefcase,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export default function PilotJobsFinderPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (service) params.set("service", service);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [service]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Find Drone Projects</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore open commercial flight contracts tailored to your equipment and credentials.
        </p>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-2xl bg-[#0c142b] border border-slate-800/80 shadow-lg flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
            placeholder="Search keywords, locations, or sensor requirements..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="">All Industry Sectors</option>
          <option value="AGRICULTURAL_SPRAYING">Agricultural Spraying</option>
          <option value="INFRASTRUCTURE_INSPECTION">Infrastructure Inspection</option>
          <option value="REAL_ESTATE_MAPPING">Real Estate Mapping</option>
          <option value="CONSTRUCTION_MONITORING">Construction Monitoring</option>
          <option value="LAND_SURVEYING">Land Surveying</option>
          <option value="AERIAL_PHOTOGRAPHY">Aerial Photography</option>
        </select>

        <button
          onClick={fetchJobs}
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
        >
          Search
        </button>
      </div>

      {/* Job listings */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#0c142b] border border-slate-800 animate-pulse h-28" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Matching Jobs Found"
          description="Try broadening your search query or removing industry filters."
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg hover:border-cyan-500/40 transition group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
                      {formatServiceType(job.serviceType)}
                    </span>
                    <StatusBadge status={job.status} type="job" />
                    {job.matchScore !== undefined && (
                      <MatchScoreBadge score={job.matchScore} size="sm" />
                    )}
                  </div>

                  <Link href={`/jobs/${job._id}`}>
                    <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                      {job.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Client: <strong className="text-slate-300">{job.companyId?.name || "Client"}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      {job.location?.city}, {job.location?.state}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      {formatDate(job.date)}
                    </span>
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="text-xl font-bold text-cyan-400">
                    {formatCurrency(job.budget)}
                  </div>
                  <Link
                    href={`/jobs/${job._id}`}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1"
                  >
                    <span>View & Apply</span>
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
