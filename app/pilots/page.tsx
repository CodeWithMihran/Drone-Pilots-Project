"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  DollarSign,
  Award,
  ArrowRight,
  Filter,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export default function PilotsDirectoryPage() {
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  const fetchPilots = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (verifiedOnly) params.set("verified", "true");

      const res = await fetch(`/api/pilots?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPilots(data.pilots || []);
      }
    } catch (err) {
      console.error("Failed to load pilots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPilots();
  }, [verifiedOnly]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPilots();
  };

  return (
    <div className="flex-1 bg-[#060b18] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Certified Flight Crew
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Verified Commercial Drone Pilots
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse FAA Part 107 certified operators equipped with enterprise LiDAR, multispectral, and thermal payloads.
          </p>
        </div>

        {/* Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0c142b] border border-slate-800/80 mb-8 shadow-lg">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pilots by name, city, skill, or drone hardware..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Only
              </span>
            </label>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
            >
              Search Pilots
            </button>
          </form>
        </div>

        {/* Pilots Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-1/2" />
                    <div className="h-3 bg-slate-800/60 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-12 bg-slate-800/40 rounded" />
              </div>
            ))}
          </div>
        ) : pilots.length === 0 ? (
          <EmptyState
            icon={Navigation}
            title="No Pilots Found"
            description="No commercial drone pilots matched your query. Try searching for a different city or skill."
            actionText="View All Pilots"
            onAction={() => {
              setSearch("");
              setVerifiedOnly(false);
              setTimeout(fetchPilots, 50);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pilots.map((pilot) => (
              <div
                key={pilot._id}
                className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg flex flex-col justify-between hover:border-cyan-500/40 transition group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 shadow-md">
                        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-cyan-300 text-base">
                          {pilot.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                          {pilot.name}
                        </h2>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {pilot.location?.city || "Available Regional"}, {pilot.location?.state}
                        </p>
                      </div>
                    </div>
                    {pilot.isVerified ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        VERIFIED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400">
                        Pilot
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 border-y border-slate-800/80">
                    <StarRating
                      rating={pilot.profile?.rating || 5.0}
                      totalReviews={pilot.profile?.totalReviews || 0}
                      size="sm"
                    />
                    <span className="text-slate-300 font-semibold">
                      {pilot.profile?.experience || 1}+ yrs exp
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {pilot.profile?.bio || "Certified commercial drone pilot specializing in high-precision aerial industrial operations."}
                  </p>

                  {/* Specializations & Hardware */}
                  <div className="space-y-2">
                    {pilot.profile?.specializations && pilot.profile.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {pilot.profile.specializations.slice(0, 2).map((s: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-[10px] text-cyan-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-cyan-400">
                      ${pilot.profile?.rate || 75}/hr
                    </span>
                    <span className="text-[10px] text-slate-500 block">Est. Rate</span>
                  </div>

                  <Link
                    href={`/pilots/${pilot._id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs transition flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
