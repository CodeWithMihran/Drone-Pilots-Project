"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building, Search, Briefcase, MapPin, Globe } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
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
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              CLIENT DIRECTORY
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Corporate Client Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Audit hiring organizations, industrial project issuers, and commercial procurement accounts across all economic sectors.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
          <Building className="w-4 h-4 text-[#fabf28]" />
          <span>Active Clients: {companies.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-5 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCompanies();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by legal name, sector, or city..."
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
              className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-zinc-950 dark:bg-zinc-850 text-[#fabf28] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {c.profile?.companyName ? c.profile.companyName.charAt(0) : "C"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{c.profile?.companyName || c.name}</h3>
                    <p className="text-xs text-[#fabf28] font-bold">{c.profile?.industry || "Commercial Services"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#fabf28]" />
                      {c.location?.city ? `${c.location.city}, ${c.location.state}` : "Location Unspecified"}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {c.profile?.description || "Industrial drone operations client."}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-border/80 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px] font-medium">
                  Posted Missions: <strong className="text-foreground font-sans font-bold">{c.totalJobsPosted || 0}</strong>
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
                  Verified Client
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
