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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
    <div className="flex-1 bg-background text-foreground py-10 sm:py-16 transition-colors animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                Verified Flight Crew
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
              Commercial Remote Pilots Directory
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Browse FAA Part 107 certified operators equipped with enterprise LiDAR, multispectral, and thermal payloads.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>FAA Airman Registry cross-checked</span>
          </div>
        </div>

        {/* Quick-Filter Payload Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-mono uppercase text-muted-foreground shrink-0 pr-1">
            Certified Hardware:
          </span>
          {[
            { label: "All Fleets", val: "" },
            { label: "DJI Matrice 350 RTK", val: "Matrice" },
            { label: "Radiometric Thermal", val: "Thermal" },
            { label: "Aerial LiDAR", val: "LiDAR" },
            { label: "DJI Agras Spray", val: "Agras" },
            { label: "Mavic 3 Enterprise", val: "Mavic" },
          ].map((pill) => {
            const isActive = search === pill.val;
            return (
              <button
                key={pill.val}
                type="button"
                onClick={() => setSearch(pill.val)}
                className={
                  "px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all duration-150 " +
                  (isActive
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-white shadow-xs"
                    : "bg-surface dark:bg-zinc-950 border-border dark:border-zinc-800 text-muted-foreground hover:text-foreground hover:border-border-strong dark:hover:border-zinc-700")
                }
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-5 shadow-xs">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by pilot name, city, skill, or drone hardware..."
                className="pl-10 text-xs bg-surface-2 dark:bg-zinc-900 border-border dark:border-zinc-800"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none px-3 py-2 rounded-control hover:bg-surface-2 dark:hover:bg-zinc-900 transition-colors">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded border-border text-primary focus:ring-ring"
              />
              <span className="flex items-center gap-1.5 text-success font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Credentials Only
              </span>
            </label>

            <Button type="submit" variant="primary" size="sm" className="w-full sm:w-auto active:scale-[0.98]">
              Search Roster
            </Button>
          </form>
        </div>

        {/* Pilots List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 animate-pulse" />
            ))}
          </div>
        ) : pilots.length === 0 ? (
          <EmptyState
            icon={Navigation}
            title="No pilots match your criteria"
            description="Try adjusting your search terms or uncheck 'Verified Only' to expand results."
            actionText="Clear Filters"
            onAction={() => {
              setSearch("");
              setVerifiedOnly(false);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pilots.map((pilot) => {
              const profile = pilot.pilotProfile;
              const isVerified = pilot.isVerified;

              return (
                <div
                  key={pilot._id}
                  className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 hover:border-border-strong dark:hover:border-zinc-700 shadow-xs hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-control bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {pilot.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                            {pilot.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                            <span>{pilot.city ? `${pilot.city}, ${pilot.state}` : "USA"}</span>
                          </div>
                        </div>
                      </div>

                      {isVerified ? (
                        <Badge variant="success" className="text-[10px] px-2 py-0.5 shrink-0">
                          Part 107
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 shrink-0">
                          Pending
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs py-2.5 border-y border-border dark:border-zinc-800/80">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                        <span className="font-semibold text-foreground">
                          {profile?.rating ? profile.rating.toFixed(1) : "5.0"}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          ({profile?.reviewCount || 0})
                        </span>
                      </div>

                      <div className="text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {profile?.experienceYears || 2}+
                        </span>{" "}
                        yrs exp
                      </div>

                      {profile?.hourlyRate && (
                        <div className="font-semibold text-foreground font-mono">
                          {formatCurrency(profile.hourlyRate)}/hr
                        </div>
                      )}
                    </div>

                    {profile?.skills && profile.skills.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Specializations
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skills.slice(0, 3).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-2 dark:bg-zinc-900 text-muted-foreground border border-border dark:border-zinc-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {profile.skills.length > 3 && (
                            <span className="text-[10px] text-muted-foreground self-center">
                              +{profile.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {profile?.drones && profile.drones.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Airframes
                        </span>
                        <p className="text-xs text-muted-foreground truncate font-mono">
                          {profile.drones[0]?.model || "Enterprise UAV"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-7 pt-0">
                    <Button asChild block variant="secondary" size="sm" className="w-full active:scale-[0.98]">
                      <Link href={`/pilots/${pilot._id}`} className="gap-1.5">
                        <span>View Credentials & Fleet</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
