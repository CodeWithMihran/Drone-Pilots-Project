"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Search, Star, MapPin, Eye, Plane } from "lucide-react";
import { StarRating } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
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
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              PILOT ROSTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Commercial Pilot Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Monitor airman compliance records, equipment payload specifications, and Part 107 accreditation status across the operator registry.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-border dark:border-zinc-800">
          <Plane className="w-4 h-4 text-[#fabf28]" />
          <span>Active Roster: {pilots.length} Pilots</span>
        </div>
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
              placeholder="Search by pilot name, license ID, city, or equipment..."
              className="pl-10 h-11 rounded-full bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
            />
          </div>
          <Button
            type="submit"
            className="rounded-full px-7 h-11 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs shrink-0"
          >
            Search
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 animate-pulse h-52" />
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
              className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{p.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#fabf28]" />
                      {p.location?.city ? `${p.location.city}, ${p.location.state}` : "Location Unspecified"}
                    </p>
                  </div>
                  {p.isVerified ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
                      Verified
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-border dark:border-zinc-800 text-muted-foreground">
                      Standard
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs py-2.5 border-y border-border/80 dark:border-zinc-800">
                  <StarRating rating={p.profile?.rating || 5.0} totalReviews={p.profile?.totalReviews || 0} size="sm" />
                  <span className="text-muted-foreground font-semibold text-[11px]">{p.profile?.experience || 2}+ yrs exp</span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground block">Payloads:</span>
                  <p className="line-clamp-2 leading-relaxed text-[11px]">{p.profile?.equipment?.join(", ") || "Standard commercial aircraft"}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border/80 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-sm font-extrabold text-foreground font-sans">${p.profile?.rate || 85}<span className="text-xs font-normal text-muted-foreground">/hr</span></span>
                <Button asChild variant="secondary" size="sm" className="rounded-full h-8 text-xs px-4 border border-border dark:border-zinc-800 font-semibold">
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
