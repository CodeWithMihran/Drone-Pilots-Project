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
    <div className="space-y-6 max-w-6xl">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Commercial Pilot Roster Audit
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Aviation compliance audit, fleet specifications, and verified credential tracking.
        </p>
      </div>

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
                placeholder="Search by pilot name, license ID, city, or equipment..."
                className="pl-9"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="px-5 shrink-0"
            >
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-panel bg-surface border border-border animate-pulse h-44" />
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
            <Card
              key={p._id}
              className="flex flex-col justify-between hover:border-border-strong transition-all"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-subtle" />
                      {p.location?.city}, {p.location?.state}
                    </p>
                  </div>
                  {p.isVerified ? (
                    <Badge variant="success" className="text-[10px]">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      Standard
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-y border-border">
                  <StarRating rating={p.profile?.rating || 5.0} totalReviews={p.profile?.totalReviews || 0} size="sm" />
                  <span className="text-muted-foreground font-medium">{p.profile?.experience || 2}+ yrs exp</span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <span className="text-[11px] font-semibold text-foreground block">Airframes & Payloads:</span>
                  <p className="line-clamp-2 leading-relaxed">{p.profile?.equipment?.join(", ") || "Standard commercial aircraft"}</p>
                </div>
              </CardContent>

              <div className="p-6 pt-0 border-t border-border flex items-center justify-between pt-4 mt-auto">
                <span className="text-xs font-bold text-foreground font-mono">${p.profile?.rate || 85}/hr</span>
                <Button asChild variant="secondary" size="sm" className="h-7 text-[11px]">
                  <Link href={`/pilots/${p._id}`}>Inspect Profile</Link>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
