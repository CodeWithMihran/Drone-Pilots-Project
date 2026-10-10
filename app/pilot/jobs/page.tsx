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
    <div className="space-y-6 max-w-5xl">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Discover Flight Contracts
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Explore open commercial flight briefs tailored to your flight radius, airframe payloads, and credentials.
        </p>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              placeholder="Search missions, site location, or sensor payload..."
              className="pl-9"
            />
          </div>

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="px-3 py-2 rounded-control bg-surface border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring sm:w-56"
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
            className="px-5 shrink-0"
          >
            Filter
          </Button>
        </CardContent>
      </Card>

      {/* Job listings */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-panel bg-surface border border-border animate-pulse h-28" />
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
            <Card key={job._id} className="hover:border-border-strong transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-[11px]">
                        {formatServiceType(job.serviceType)}
                      </Badge>
                      <StatusBadge status={job.status} type="job" />
                      {job.matchScore !== undefined && (
                        <MatchScoreBadge score={job.matchScore} size="sm" />
                      )}
                    </div>

                    <Link href={`/jobs/${job._id}`}>
                      <h2 className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                        {job.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                      <span>Client: <strong className="text-foreground">{job.companyId?.name || "Client"}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-subtle" />
                        {job.location?.city}, {job.location?.state}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-subtle" />
                        Flight Date: {formatDate(job.date)}
                      </span>
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                    <div className="text-xl font-bold text-foreground font-mono">
                      {formatCurrency(job.budget)}
                    </div>
                    <Button asChild variant="primary" size="sm">
                      <Link href={`/jobs/${job._id}`} className="gap-1 font-semibold">
                        <span>Review Scope</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
