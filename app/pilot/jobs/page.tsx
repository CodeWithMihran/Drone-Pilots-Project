"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              MISSION DISPATCH
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Available Flight Missions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Browse open commercial drone shoots calibrated to your sensor payload profile, flight hours, and Part 107 certification.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
          <Briefcase className="w-4 h-4 text-[#fabf28]" />
          <span>Active Opportunities: {jobs.length}</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              placeholder="Search by shoot type, city, or equipment requirements..."
              className="pl-10 h-11 rounded-full bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
            />
          </div>

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="px-4 py-2 h-11 rounded-full bg-surface dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground text-xs font-medium focus:outline-none focus:border-[#fabf28] sm:w-56"
          >
            <option value="">All Categories</option>
            <option value="AERIAL_PHOTOGRAPHY">Weddings & Events</option>
            <option value="REAL_ESTATE_MAPPING">Real Estate & 3D Tours</option>
            <option value="FILM_PRODUCTION">Film & Production</option>
            <option value="AGRICULTURAL_SPRAYING">Agricultural Spraying</option>
            <option value="LAND_SURVEYING">Surveying & LiDAR</option>
            <option value="INFRASTRUCTURE_INSPECTION">Infrastructure Inspection</option>
          </select>

          <Button
            onClick={fetchJobs}
            className="rounded-full px-7 h-11 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs shrink-0"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Job listings */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-7 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 animate-pulse h-36" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No matching missions found"
          description="Try broadening your search keywords or switching category filters."
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#fabf28]/15 border border-[#fabf28]/25 text-[11px] font-bold text-zinc-900 dark:text-[#fabf28]">
                      {formatServiceType(job.serviceType)}
                    </span>
                    <StatusBadge status={job.status} type="job" />
                    {job.matchScore !== undefined && (
                      <MatchScoreBadge score={job.matchScore} size="sm" />
                    )}
                  </div>

                  <Link href={`/jobs/${job._id}`}>
                    <h2 className="text-base sm:text-xl font-bold text-foreground hover:text-[#fabf28] transition-colors tracking-tight line-clamp-1">
                      {job.title}
                    </h2>
                  </Link>

                  <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2.5 pt-0.5">
                    <span>Client: <strong className="text-foreground font-semibold">{job.companyId?.name || "Client"}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#fabf28]" />
                      {job.location?.city}, {job.location?.state}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      Shoot Date: {formatDate(job.date)}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border dark:border-zinc-800">
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold text-foreground font-sans">
                      {formatCurrency(job.budget)}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block text-right">
                      Escrow Budget
                    </span>
                  </div>
                  <Button asChild size="sm" className="rounded-full px-6 h-10 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs">
                    <Link href={`/jobs/${job._id}`} className="gap-1.5">
                      <span>View Brief</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
