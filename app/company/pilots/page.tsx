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
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Verified Commercial Pilots
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Browse FAA Part 107 verified operators equipped with enterprise sensors, LiDAR, and thermal cameras.
          </p>
        </div>

        <Button asChild variant="primary" size="sm" className="gap-1.5 self-start sm:self-auto">
          <Link href="/company/post-job">
            <Briefcase className="w-4 h-4" />
            <span>Post Mission to Hire</span>
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchPilots();
            }}
            className="flex gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by pilot name, base location, LiDAR, thermal, or agricultural payload..."
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="primary" size="sm" className="px-5 shrink-0">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Pilots Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-panel bg-surface border border-border animate-pulse h-48" />
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
            <Card
              key={pilot._id}
              className="flex flex-col justify-between hover:border-border-strong transition-all"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-control bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                      {pilot.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground leading-tight">
                        {pilot.name}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-subtle" />
                        {pilot.location?.city || "Station Base"}, {pilot.location?.state}
                      </p>
                    </div>
                  </div>

                  <Badge variant="success" className="text-[10px] px-2 py-0 shrink-0">
                    Part 107
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-y border-border">
                  <StarRating
                    rating={pilot.profile?.rating || 5.0}
                    totalReviews={pilot.profile?.totalReviews || 0}
                    size="sm"
                  />
                  <span className="text-muted-foreground font-medium">
                    {pilot.profile?.experience || 2}+ yrs exp
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {pilot.profile?.bio || "Licensed commercial remote pilot specializing in enterprise photogrammetry and aerial inspections."}
                </p>

                {pilot.profile?.equipment && pilot.profile.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {pilot.profile.equipment.slice(0, 2).map((eq: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-surface-2 border border-border text-foreground font-mono">
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>

              <div className="p-6 pt-0 border-t border-border flex items-center justify-between mt-auto pt-4">
                <div>
                  <span className="text-xs font-bold text-foreground font-mono">${pilot.profile?.rate || 85}/hr</span>
                  <span className="text-[10px] text-subtle block">Standard Rate</span>
                </div>

                <Button asChild variant="secondary" size="sm">
                  <Link href={`/pilots/${pilot._id}`} className="gap-1 text-xs">
                    <span>Credentials</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
