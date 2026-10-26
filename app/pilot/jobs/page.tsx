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
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Commercial Flight Tender Dispatch
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Available Flight Contracts
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Explore open commercial missions calibrated to your fleet airframes, sensor payloads, and Part 107 verification.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <Briefcase className="w-4 h-4 text-primary" />
          <span>Active Opportunities: {jobs.length}</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              placeholder="Search missions, site location, or sensor payload..."
              className="pl-9 h-10 bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
            />
          </div>

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="px-3 py-2 h-10 rounded-control bg-surface dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground text-xs focus:outline-none focus:border-primary sm:w-56"
          >
            <option value="">All Industrial Sectors</option>
            <option value="AGRICULTURAL_SPRAYING">Agricultural Spraying</option>
            <option value="INFRASTRUCTURE_INSPECTION">Infrastructure Inspection</option>
            <option value="REAL_ESTATE_MAPPING">Real Estate & 3D Mapping</option>
            <option value="CONSTRUCTION_MONITORING">Construction Monitoring</option>
            <option value="LAND_SURVEYING">Land Surveying & LiDAR</option>
            <option value="AERIAL_PHOTOGRAPHY">Commercial Aerial Media</option>
          </select>

          <Button
            onClick={fetchJobs}
            variant="primary"
            size="sm"
            className="px-5 shrink-0 h-10"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Job listings */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-7 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 animate-pulse h-32" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No matching missions found"
          description="Try broadening your search query or removing industry category filters."
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-[11px] font-medium text-foreground">
                      {formatServiceType(job.serviceType)}
                    </span>
                    <StatusBadge status={job.status} type="job" />
                    {job.matchScore !== undefined && (
                      <MatchScoreBadge score={job.matchScore} size="sm" />
                    )}
                  </div>

                  <Link href={`/jobs/${job._id}`}>
                    <h2 className="text-base sm:text-lg font-semibold text-foreground hover:text-primary transition-colors tracking-tight">
                      {job.title}
                    </h2>
                  </Link>

                  <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-2.5 pt-0.5">
                    <span>Client: <strong className="text-foreground">{job.companyId?.name || "Client"}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {job.location?.city}, {job.location?.state}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-subtle" />
                      Flight Date: {formatDate(job.date)}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border dark:border-zinc-800">
                  <div className="text-xl font-bold text-foreground font-mono">
                    {formatCurrency(job.budget)}
                  </div>
                  <Button asChild variant="primary" size="sm" className="h-9 px-4">
                    <Link href={`/jobs/${job._id}`} className="gap-1.5 font-semibold text-xs">
                      <span>Review Scope</span>
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
