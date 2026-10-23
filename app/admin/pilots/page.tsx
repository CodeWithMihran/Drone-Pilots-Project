"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Search, Star, MapPin, Eye, Plane } from "lucide-react";
import { StarRating } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminPilotsDirectoryPage() {
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPilots = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);

      const res = await fetch(`/api/pilots?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPilots(data.pilots || []);
      }
    } catch (err) {
      console.error("Admin fetch pilots error:", err);
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Aviation Compliance Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Commercial Pilot Roster Audit
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Monitor airman compliance records, equipment payload specifications, and Part 107 accreditation status across the operator registry.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <Plane className="w-4 h-4 text-primary" />
          <span>Active Roster: {pilots.length} Pilots</span>
        </div>
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
              placeholder="Search by pilot name, license ID, city, or equipment..."
              className="pl-9 h-10 bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="px-5 shrink-0 h-10 font-semibold text-xs"
          >
            Search
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800 animate-pulse h-48" />
          ))
        ) : pilots.length === 0 ? (
          <div className="col-span-3">
            <EmptyState
              icon={Plane}
              title="No pilots found"
              description="No pilot records match the current search."
            />
          </div>
        ) : (
          pilots.map((p) => (
            <div
              key={p._id}
              className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 shadow-xs flex flex-col justify-between hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{p.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {p.location?.city ? `${p.location.city}, ${p.location.state}` : "Location Unspecified"}
                    </p>
                  </div>
                  {p.isVerified ? (
                    <Badge variant="success" className="text-[10px] px-2 py-0.5">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                      Standard
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs py-2.5 border-y border-border dark:border-zinc-800">
                  <StarRating rating={p.profile?.rating || 5.0} totalReviews={p.profile?.totalReviews || 0} size="sm" />
                  <span className="text-muted-foreground font-medium text-[11px]">{p.profile?.experience || 2}+ yrs exp</span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <span className="text-[11px] font-semibold text-foreground block">Airframes & Payloads:</span>
                  <p className="line-clamp-2 leading-relaxed text-[11px]">{p.profile?.equipment?.join(", ") || "Standard commercial aircraft"}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border dark:border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-bold text-foreground font-mono">${p.profile?.rate || 85}<span className="text-xs font-normal text-muted-foreground">/hr</span></span>
                <Button asChild variant="secondary" size="sm" className="h-8 text-xs px-3">
                  <Link href={`/pilots/${p._id}`}>Inspect Profile</Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
