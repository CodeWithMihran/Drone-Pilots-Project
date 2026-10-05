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
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Commercial Flight Marketplace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Browse Industrial Drone Projects
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verified high-value missions across agriculture, surveying, energy, and infrastructure.
            </p>
          </div>

          <Link
            href="/company/post-job"
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Post New Drone Project</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c142b] border border-slate-800/80 mb-8 shadow-lg">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search job title, keywords, or equipment..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-3 relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or state..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#070e22] border border-slate-700/80 text-white text-xs focus:outline-none focus:border-cyan-500"
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
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Filter
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
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
          <div className="p-5 rounded-2xl bg-[#0c142b] border border-slate-800/80 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                Filter Criteria
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Clear All
              </button>
            </div>

            {/* Service Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Industry Sector
              </label>
              <div className="space-y-1.5 text-xs">
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
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition text-xs ${
                      serviceType === s.val
                        ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Budget (USD)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  placeholder="Min $"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#070e22] border border-slate-700 text-xs text-white placeholder:text-slate-500"
                />
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  placeholder="Max $"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#070e22] border border-slate-700 text-xs text-white placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={fetchJobs}
                className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium transition"
              >
                Apply Budget
              </button>
            </div>

            {/* Required Experience */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Max Required Experience
              </label>
              <select
                value={experience}
                onChange={(e) => {
                  setExperience(e.target.value);
                  setTimeout(fetchJobs, 50);
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#070e22] border border-slate-700 text-xs text-white"
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
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {jobs.length} project opportunities</span>
            <span>Sorted by Latest Postings</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#0c142b] border border-slate-800 animate-pulse space-y-3"
                >
                  <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-800/60 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-800/40 rounded w-full"></div>
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
                className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg hover:border-cyan-500/40 transition group relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold">
                        {formatServiceType(job.serviceType)}
                      </span>
                      <StatusBadge status={job.status} type="job" />
                      {job.matchScore !== undefined && (
                        <MatchScoreBadge score={job.matchScore} size="sm" />
                      )}
                    </div>

                    <Link href={`/jobs/${job._id}`}>
                      <h2 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                        {job.title}
                      </h2>
                    </Link>

                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>Posted by <strong className="text-slate-300">{job.companyId?.name || "Verified Client"}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.location?.city}, {job.location?.state}
                      </span>
                    </p>
                  </div>

                  <div className="text-right sm:shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
                    <div className="text-xl sm:text-2xl font-black text-cyan-400">
                      {formatCurrency(job.budget)}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Fixed Project Budget
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 my-4 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Requirements & Gear badges */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800/70 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 text-slate-300 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Flight Date: {formatDate(job.date)}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>Duration: {job.duration}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Req: {job.requiredCertification || "Part 107"}</span>
                  </div>

                  <div className="ml-auto pt-2 sm:pt-0">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs transition flex items-center gap-1.5"
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
    <div className="flex-1 bg-[#060b18] py-8 sm:py-12">
      <Suspense fallback={<div className="text-white text-xs max-w-7xl mx-auto px-4">Loading jobs marketplace...</div>}>
        <JobsMarketplaceContent />
      </Suspense>
    </div>
  );
}
