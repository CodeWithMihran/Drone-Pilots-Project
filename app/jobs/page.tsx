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
  ArrowRight,
  SlidersHorizontal,
  X,
  Layers,
  ArrowUpRight,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#faf8f5] dark:bg-[#0c0c0e] border border-zinc-200/90 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#fabf28] font-bold text-base leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              MISSION MARKETPLACE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Browse Commercial Missions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Discover verified commercial drone projects across infrastructure inspection, precision agriculture, surveying, and thermal analytics.
          </p>
        </div>

        <Link
          href="/company/post-job"
          className="self-start md:self-auto px-6 py-3 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 active:scale-[0.98]"
        >
          <Briefcase className="w-4 h-4" />
          <span>Post a Mission</span>
        </Link>
      </div>

      {/* Quick-Filter Sector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-[11px] font-mono uppercase text-muted-foreground shrink-0 pr-1">
          Sector:
        </span>
        {[
          { label: "All Missions", val: "" },
          { label: "LiDAR Surveying", val: "LAND_SURVEYING" },
          { label: "Thermal Inspection", val: "INFRASTRUCTURE_INSPECTION" },
          { label: "3D Mapping", val: "REAL_ESTATE_MAPPING" },
          { label: "Agricultural Spray", val: "AGRICULTURAL_SPRAYING" },
          { label: "Construction Monitoring", val: "CONSTRUCTION_MONITORING" },
          { label: "Aerial Cinematography", val: "AERIAL_PHOTOGRAPHY" },
        ].map((pill) => {
          const isActive = serviceType === pill.val;
          return (
            <button
              key={pill.val}
              type="button"
              onClick={() => setServiceType(pill.val)}
              className={
                "px-4 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all duration-150 " +
                (isActive
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-950 dark:border-white shadow-xs"
                  : "bg-white dark:bg-[#121214] border-zinc-200/90 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:border-zinc-350 dark:hover:border-zinc-700")
              }
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Search Bar Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#121214] border border-zinc-200/90 dark:border-zinc-800 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mission title, keywords, or airframes..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#faf8f5] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-[#fabf28] transition-colors"
            />
          </div>

          <div className="sm:col-span-3 relative">
            <MapPin className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or state..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#faf8f5] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:border-[#fabf28] transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-foreground text-xs focus:outline-none focus:border-[#fabf28] transition-colors"
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
              className="flex-1 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2.5 rounded-xl bg-[#faf8f5] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 text-muted-foreground hover:text-foreground transition-colors"
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
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121214] border border-zinc-200/90 dark:border-zinc-800 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#fabf28]" />
                Filter Criteria
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-muted-foreground hover:text-[#fabf28] font-semibold transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2">
                Industry Sector
              </label>
              <div className="space-y-1">
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
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors text-xs font-medium ${
                      serviceType === s.val
                        ? "bg-[#fabf28]/15 text-zinc-950 dark:text-[#fabf28] font-bold"
                        : "text-muted-foreground hover:text-foreground hover:bg-[#faf8f5] dark:hover:bg-zinc-900"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2">
                Budget (USD)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="Min $"
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#fabf28] transition-colors"
                />
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="Max $"
                  className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#fabf28] transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={fetchJobs}
                className="w-full mt-2 py-2 rounded-xl bg-[#faf8f5] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-100 text-xs font-bold text-foreground transition-colors"
              >
                Apply Budget
              </button>
            </div>

            {/* Required Experience */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-2">
                Experience Level
              </label>
              <select
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);
                  setTimeout(fetchJobs, 50);
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-foreground focus:outline-none focus:border-[#fabf28] transition-colors"
              >
                <option value="">Any Experience Level</option>
                <option value="1">1+ Year Commercial</option>
                <option value="3">3+ Years Commercial</option>
                <option value="5">5+ Years Commercial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Showing <strong className="text-foreground">{jobs.length}</strong> active missions</span>
            <span className="font-mono text-[11px]">Sorted by Latest</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-7 rounded-3xl bg-white dark:bg-[#121214] border border-zinc-200/90 dark:border-zinc-800 animate-pulse space-y-3"
                >
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
                  <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No Commercial Missions Found"
              description="No projects currently match your exact filter criteria. Try broadening your location, budget, or service categories."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121214] border border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:border-zinc-350 dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300 group relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-3 py-1 rounded-full bg-[#fabf28]/15 text-zinc-900 dark:text-[#fabf28] text-xs font-bold">
                        {formatServiceType(job.serviceType)}
                      </span>
                      <StatusBadge status={job.status} type="job" />
                      {job.matchScore !== undefined && (
                        <MatchScoreBadge score={job.matchScore} size="sm" />
                      )}
                    </div>

                    <Link href={`/jobs/${job._id}`}>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                        {job.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <span>
                        Posted by <strong className="text-foreground font-semibold">{job.companyId?.name || "Verified Client"}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#fabf28]" />
                        {job.location?.city}, {job.location?.state}
                      </span>
                    </p>
                  </div>

                  <div className="text-right sm:shrink-0 flex sm:flex-col items-center sm:items-end justify-between pt-2 sm:pt-0">
                    <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight font-mono">
                      {formatCurrency(job.budget)}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium">
                      Fixed Project Budget
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground my-4 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Requirements & Gear badges */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Flight Date: {formatDate(job.date)}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Duration: {job.duration}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Req: {job.requiredCertification || "Part 107"}</span>
                  </div>

                  <div className="ml-auto pt-2 sm:pt-0">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="px-5 py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-100 font-bold text-xs transition-all flex items-center gap-1.5 active:scale-[0.98] shadow-xs"
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
    <div className="flex-1 bg-[#faf8f5] dark:bg-[#070709] py-10 sm:py-16 transition-colors duration-150">
      <Suspense fallback={<div className="text-foreground text-xs max-w-7xl mx-auto px-4 font-mono">Loading missions marketplace...</div>}>
        <JobsMarketplaceContent />
      </Suspense>
    </div>
  );
}
