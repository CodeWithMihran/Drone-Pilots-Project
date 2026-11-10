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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              PILOT DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Verified Commercial Pilots
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Browse FAA Part 107 verified operators equipped with enterprise cinema, LiDAR, and thermal cameras ready for dispatch.
          </p>
        </div>

        <Button asChild className="rounded-full gap-2 shrink-0 h-10 px-6 font-bold text-xs bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 shadow-xs">
          <Link href="/company/post-job">
            <Briefcase className="w-4 h-4" />
            <span>Post a Mission</span>
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-5 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPilots();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pilot name, location, LiDAR, thermal, or camera payload..."
              className="pl-10 h-11 rounded-full bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
            />
          </div>
          <Button type="submit" className="rounded-full px-7 h-11 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs shrink-0">
            Search
          </Button>
        </form>
      </div>

      {/* Pilots Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 animate-pulse h-56" />
          ))}
        </div>
      ) : pilots.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="No verified pilots found"
          description="No pilots matched your criteria. Try adjusting your search query."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pilots.map((pilot) => (
            <div
              key={pilot._id}
              className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-zinc-950 dark:bg-zinc-850 text-[#fabf28] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {pilot.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground leading-tight">
                        {pilot.name}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#fabf28]" />
                        {pilot.location?.city || "Station Base"}, {pilot.location?.state}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 shrink-0">
                    Part 107
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2.5 border-y border-border/80 dark:border-zinc-800">
                  <StarRating
                    rating={pilot.profile?.rating || 5.0}
                    totalReviews={pilot.profile?.totalReviews || 0}
                    size="sm"
                  />
                  <span className="text-muted-foreground font-semibold text-[11px]">
                    {pilot.profile?.experience || 2}+ yrs exp
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {pilot.profile?.bio || "Licensed commercial remote pilot specializing in enterprise photogrammetry and aerial inspections."}
                </p>

                {pilot.profile?.equipment && pilot.profile.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pilot.profile.equipment.slice(0, 2).map((eq: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full text-[10px] bg-zinc-100 dark:bg-zinc-800 border border-border dark:border-zinc-800 text-foreground font-semibold">
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-5 border-t border-border/80 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-foreground font-sans">${pilot.profile?.rate || 85}</span>
                  <span className="text-[11px] text-muted-foreground"> / hour</span>
                </div>

                <Button asChild variant="secondary" size="sm" className="rounded-full h-9 text-xs px-4 border border-border dark:border-zinc-800 font-semibold">
                  <Link href={`/pilots/${pilot._id}`} className="gap-1.5">
                    <span>Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
