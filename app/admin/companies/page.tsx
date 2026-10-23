"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building, Search, Briefcase, MapPin, Globe } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminCompaniesDirectoryPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);

      const res = await fetch(`/api/companies?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(data.companies || []);
      }
    } catch (err) {
      console.error("Admin fetch companies error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
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
              Commercial Enterprise Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Corporate Client Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Audit hiring organizations, industrial project issuers, and commercial procurement accounts across all economic sectors.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <Building className="w-4 h-4 text-primary" />
          <span>Active Clients: {companies.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-5 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCompanies();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by legal name, sector, or city..."
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
        ) : companies.length === 0 ? (
          <div className="col-span-3">
            <EmptyState
              icon={Building}
              title="No companies found"
              description="No enterprise client records matched your search."
            />
          </div>
        ) : (
          companies.map((c) => (
            <div
              key={c._id}
              className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 shadow-xs flex flex-col justify-between hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-control bg-primary/15 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {c.profile?.companyName ? c.profile.companyName.charAt(0) : "C"}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{c.profile?.companyName || c.name}</h3>
                    <p className="text-xs text-primary font-medium">{c.profile?.industry || "Commercial Services"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {c.location?.city ? `${c.location.city}, ${c.location.state}` : "Location Unspecified"}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {c.profile?.description || "Industrial drone operations client."}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">
                  Posted Missions: <strong className="text-foreground font-mono">{c.totalJobsPosted || 0}</strong>
                </span>
                <Badge variant="success" className="text-[10px] px-2 py-0.5">
                  Verified Client
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
