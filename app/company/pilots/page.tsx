"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Award,
  ArrowRight,
  Plane,
  Briefcase,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";

export default function CompanyPilotsDirectoryPage() {
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPilots = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("verified", "true");

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
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Verified Commercial Pilots</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse FAA Part 107 verified pilots with enterprise sensors and certified flight hours.
          </p>
        </div>

        <Link
          href="/company/post-job"
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Briefcase className="w-4 h-4" />
          <span>Post Tender to Hire</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c142b] border border-slate-800/80 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPilots();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, location, LiDAR, thermal, or agricultural payload..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Pilots Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800 animate-pulse h-48" />
          ))}
        </div>
      ) : pilots.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="No Pilots Found"
          description="No verified pilots matched your criteria. Try searching for a different skill or city."
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
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                        {pilot.name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {pilot.location?.city || "Regional"}, {pilot.location?.state}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED
                  </span>
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
                  {pilot.profile?.bio || "Licensed commercial drone operator specializing in industrial flight surveys and mapping."}
                </p>

                {pilot.profile?.equipment && pilot.profile.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {pilot.profile.equipment.slice(0, 2).map((eq: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] text-cyan-300">
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400">${pilot.profile?.rate || 75}/hr</span>
                  <span className="text-[10px] text-slate-500 block">Est. Rate</span>
                </div>

                <Link
                  href={`/pilots/${pilot._id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs transition flex items-center gap-1"
                >
                  <span>View Credentials</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
