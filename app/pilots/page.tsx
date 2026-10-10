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
    <div className="flex-1 bg-background text-foreground py-8 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Badge variant="outline" className="mb-2">
            Verified Flight Crew
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
            Commercial Remote Pilots
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Browse FAA Part 107 certified operators equipped with enterprise LiDAR, multispectral, and thermal payloads.
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by pilot name, city, skill, or drone hardware..."
                  className="pl-9"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none px-2 py-1">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-ring"
                />
                <span className="flex items-center gap-1 text-success font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Credentials Only
                </span>
              </label>

              <Button type="submit" variant="primary" size="sm" className="w-full sm:w-auto">
                Search Roster
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Pilots List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-panel bg-surface border border-border animate-pulse" />
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
                <Card
                  key={pilot._id}
                  className="hover:border-border-strong transition-all flex flex-col justify-between"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-control bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                          {pilot.name ? pilot.name.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground leading-tight">
                            {pilot.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3 text-subtle shrink-0" />
                            <span>{pilot.city ? `${pilot.city}, ${pilot.state}` : "USA"}</span>
                          </div>
                        </div>
                      </div>

                      {isVerified ? (
                        <Badge variant="success" className="text-[10px] px-2 py-0 shrink-0">
                          Part 107
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] px-2 py-0 shrink-0">
                          Pending
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs py-2 border-y border-border">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                        <span className="font-semibold text-foreground">
                          {profile?.rating ? profile.rating.toFixed(1) : "5.0"}
                        </span>
                        <span className="text-subtle">
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
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-subtle block">
                          Specializations
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {profile.skills.slice(0, 3).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-2 text-muted-foreground border border-border"
                            >
                              {skill}
                            </span>
                          ))}
                          {profile.skills.length > 3 && (
                            <span className="text-[10px] text-subtle self-center">
                              +{profile.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {profile?.drones && profile.drones.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-subtle block">
                          Airframes
                        </span>
                        <p className="text-xs text-muted-foreground truncate font-mono">
                          {profile.drones[0]?.model || "Enterprise UAV"}
                        </p>
                      </div>
                    )}
                  </CardContent>

                  <div className="p-6 pt-0">
                    <Button asChild block variant="secondary" size="sm">
                      <Link href={`/pilots/${pilot._id}`} className="gap-1.5">
                        <span>View Credentials & Fleet</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
