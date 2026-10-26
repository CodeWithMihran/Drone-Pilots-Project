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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Aviation Operations & Flight Crew
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Verified Commercial Pilots
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Browse FAA Part 107 verified operators equipped with enterprise LiDAR, multispectral, and thermal sensors ready for dispatch.
          </p>
        </div>

        <Button asChild variant="primary" size="sm" className="gap-2 shrink-0 h-10 px-5 font-semibold text-xs">
          <Link href="/company/post-job">
            <Briefcase className="w-4 h-4" />
            <span>Post Mission to Hire</span>
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-5 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPilots();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pilot name, base location, LiDAR, thermal, or agricultural payload..."
              className="pl-9 h-10 bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" className="px-5 shrink-0 h-10">
            Search
          </Button>
        </form>
      </div>

      {/* Pilots Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800 animate-pulse h-52" />
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
              className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 shadow-xs flex flex-col justify-between hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-control bg-primary/15 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                      {pilot.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground leading-tight">
                        {pilot.name}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {pilot.location?.city || "Station Base"}, {pilot.location?.state}
                      </p>
                    </div>
                  </div>

                  <Badge variant="success" className="text-[10px] px-2 py-0.5 shrink-0">
                    Part 107
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs py-2.5 border-y border-border dark:border-zinc-800">
                  <StarRating
                    rating={pilot.profile?.rating || 5.0}
                    totalReviews={pilot.profile?.totalReviews || 0}
                    size="sm"
                  />
                  <span className="text-muted-foreground font-medium text-[11px]">
                    {pilot.profile?.experience || 2}+ yrs exp
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {pilot.profile?.bio || "Licensed commercial remote pilot specializing in enterprise photogrammetry and aerial inspections."}
                </p>

                {pilot.profile?.equipment && pilot.profile.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pilot.profile.equipment.slice(0, 2).map((eq: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground font-mono">
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-border dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-foreground font-mono">${pilot.profile?.rate || 85}</span>
                  <span className="text-[10px] text-muted-foreground"> / hour</span>
                </div>

                <Button asChild variant="secondary" size="sm" className="h-8 text-xs px-3">
                  <Link href={`/pilots/${pilot._id}`} className="gap-1">
                    <span>Credentials</span>
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
