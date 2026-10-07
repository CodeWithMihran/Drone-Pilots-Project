"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  SlidersHorizontal,
  X,
  Layers,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

function JobsMarketplaceContent() {
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [serviceType, setServiceType] = useState(searchParams.get("service") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [budgetMin, setBudgetMin] = useState(searchParams.get("budgetMin") || "");
  const [budgetMax, setBudgetMax] = useState(searchParams.get("budgetMax") || "");
  const [experience, setExperience] = useState(searchParams.get("experience") || "");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (serviceType) params.set("service", serviceType);
      if (location) params.set("location", location);
      if (budgetMin) params.set("budgetMin", budgetMin);
      if (budgetMax) params.set("budgetMax", budgetMax);
      if (experience) params.set("experience", experience);

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
  }, [serviceType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearch("");
    setServiceType("");
    setLocation("");
    setBudgetMin("");
    setBudgetMax("");
    setExperience("");
    setTimeout(fetchJobs, 50);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-caption font-semibold uppercase tracking-widest text-primary">
              Commercial Flight Marketplace
            </span>
            <h1 className="text-heading-1 font-bold text-foreground mt-1">
              Browse Industrial Drone Projects
            </h1>
            <p className="text-body text-muted-foreground mt-1">
              Verified high-value missions across agriculture, surveying, energy, and infrastructure.
            </p>
          </div>

          <Link
            href="/company/post-job"
            className="self-start md:self-auto px-4 py-2.5 rounded-control bg-primary hover:bg-primary/90 text-primary-foreground text-label font-medium shadow-md transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Post New Drone Project</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-panel bg-card border border-border mb-8 shadow-md">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title, keywords, or equipment..."
              className="w-full pl-10 pr-4 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="sm:col-span-3 relative">
            <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or state..."
              className="w-full pl-10 pr-4 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">All Services</option>
              <option value="AGRICULTURAL_SPRAYING">Agricultural Spraying</option>
              <option value="INFRASTRUCTURE_INSPECTION">Infrastructure Inspection</option>
              <option value="REAL_ESTATE_MAPPING">Real Estate Mapping</option>
              <option value="CONSTRUCTION_MONITORING">Construction Monitoring</option>
              <option value="LAND_SURVEYING">Land Surveying</option>
              <option value="AERIAL_PHOTOGRAPHY">Aerial Photography</option>
              <option value="OTHER">Other Services</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-control bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-body shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2.5 rounded-control bg-surface-2 border border-border hover:bg-border/30 text-muted-foreground hover:text-foreground transition-colors"
              title="Reset filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Layout: Filters Sidebar + Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="p-5 rounded-panel bg-card border border-border space-y-5 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-caption font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
                Filter Criteria
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-caption text-primary hover:underline font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-label font-medium text-foreground mb-2">
                Industry Sector
              </label>
              <div className="space-y-1.5">
                {[
                  { label: "All Sectors", val: "" },
                  { label: "Agricultural Spraying", val: "AGRICULTURAL_SPRAYING" },
                  { label: "Infrastructure Inspection", val: "INFRASTRUCTURE_INSPECTION" },
                  { label: "Real Estate & Mapping", val: "REAL_ESTATE_MAPPING" },
                  { label: "Construction Monitoring", val: "CONSTRUCTION_MONITORING" },
                  { label: "Land Surveying", val: "LAND_SURVEYING" },
                  { label: "Aerial Photography", val: "AERIAL_PHOTOGRAPHY" },
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => setServiceType(s.val)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-control transition-colors text-caption ${
                      serviceType === s.val
                        ? "bg-primary/10 text-primary font-semibold border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-label font-medium text-foreground mb-2">
                Budget (USD)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="Min $"
                  className="w-full px-2.5 py-1.5 rounded-control bg-surface-2 border border-border text-caption text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="Max $"
                  className="w-full px-2.5 py-1.5 rounded-control bg-surface-2 border border-border text-caption text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={fetchJobs}
                className="w-full mt-2 py-1.5 rounded-control bg-surface-2 border border-border hover:bg-border/30 text-primary text-caption font-medium transition-colors"
              >
                Apply Budget
              </button>
            </div>

            {/* Required Experience */}
            <div>
              <label className="block text-label font-medium text-foreground mb-2">
                Max Required Experience
              </label>
              <select
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);
                  setTimeout(fetchJobs, 50);
                }}
                className="w-full px-2.5 py-1.5 rounded-control bg-surface-2 border border-border text-caption text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Any Experience Level</option>
                <option value="1">1+ Year Experience</option>
                <option value="3">3+ Years Experience</option>
                <option value="5">5+ Years Experience</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-caption text-muted-foreground px-1">
            <span>Showing {jobs.length} project opportunities</span>
            <span>Sorted by Latest Postings</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-panel bg-card border border-border animate-pulse space-y-3"
                >
                  <div className="h-4 bg-surface-2 rounded w-1/3"></div>
                  <div className="h-3 bg-surface-2 rounded w-1/2"></div>
                  <div className="h-10 bg-surface-2 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No Drone Jobs Found"
              description="No projects currently match your exact filter criteria. Try broadening your location, budget, or service categories."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 rounded-panel bg-card border border-border shadow-md hover:border-primary/50 transition-colors group relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-caption font-medium">
                        {formatServiceType(job.serviceType)}
                      </span>
                      <StatusBadge status={job.status} type="job" />
                      {job.matchScore !== undefined && (
                        <MatchScoreBadge score={job.matchScore} size="sm" />
                      )}
                    </div>

                    <Link href={`/jobs/${job._id}`}>
                      <h2 className="text-label font-semibold text-foreground group-hover:text-primary transition-colors text-lg">
                        {job.title}
                      </h2>
                    </Link>

                    <p className="text-caption text-muted-foreground flex items-center gap-2">
                      <span>
                        Posted by <strong className="text-foreground font-medium">{job.companyId?.name || "Verified Client"}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {job.location?.city}, {job.location?.state}
                      </span>
                    </p>
                  </div>

                  <div className="text-right sm:shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
                    <div className="text-heading-2 font-bold text-primary">
                      {formatCurrency(job.budget)}
                    </div>
                    <span className="text-caption text-muted-foreground font-medium">
                      Fixed Project Budget
                    </span>
                  </div>
                </div>

                <p className="text-body text-muted-foreground my-4 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Requirements & Gear badges */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border text-caption text-muted-foreground">
                  <div className="flex items-center gap-1 text-foreground font-medium">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>Flight Date: {formatDate(job.date)}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-info" />
                    <span>Duration: {job.duration}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-success">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Req: {job.requiredCertification || "Part 107"}</span>
                  </div>

                  <div className="ml-auto pt-2 sm:pt-0">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="px-4 py-2 rounded-control bg-surface-2 border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary text-primary font-medium text-caption transition-colors flex items-center gap-1.5"
                    >
                      <span>View & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobsMarketplacePage() {
  return (
    <div className="flex-1 bg-background py-8 sm:py-12">
      <Suspense fallback={<div className="text-foreground text-caption max-w-7xl mx-auto px-4">Loading jobs marketplace...</div>}>
        <JobsMarketplaceContent />
      </Suspense>
    </div>
  );
}