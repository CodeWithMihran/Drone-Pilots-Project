"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminJobsManagementPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Admin fetch jobs error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              MISSION AUDIT
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Platform Missions & Contracts
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Audit commercial job postings, monitor procurement lifecycles, and track contract escrow assignments across commercial sectors.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
          <Briefcase className="w-4 h-4 text-[#fabf28]" />
          <span>Total Operations: {jobs.length}</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
          {[
            { label: "All Missions", val: "ALL" },
            { label: "Open", val: "OPEN" },
            { label: "Proposals In", val: "APPLICATIONS_RECEIVED" },
            { label: "Pilot Assigned", val: "PILOT_SELECTED" },
            { label: "In Flight", val: "IN_PROGRESS" },
            { label: "Completed", val: "COMPLETED" },
            { label: "Cancelled", val: "CANCELLED" },
          ].map((tab) => {
            const active = statusFilter === tab.val;
            return (
              <button
                key={tab.val}
                onClick={() => setStatusFilter(tab.val)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  active
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              placeholder="Search by mission title, city, or client organization..."
              className="pl-10 h-11 rounded-full bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
            />
          </div>
          <Button
            onClick={fetchJobs}
            className="rounded-full px-7 h-11 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs shrink-0"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
            FLIGHT CONTRACTS REGISTRY ({jobs.length})
          </span>
        </div>
        <div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-surface-2 dark:bg-zinc-850 rounded-2xl animate-pulse border border-border/60 dark:border-zinc-800" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Briefcase}
                title="No missions found"
                description="No operations match your current filter criteria."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border dark:border-zinc-800 bg-[#faf8f5]/60 dark:bg-zinc-900/60 text-muted-foreground font-semibold">
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Mission Title & Sector</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Client Organization</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Assigned Pilot</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Contract Budget</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Flight Date</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Status</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px] text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80 dark:divide-zinc-800/80">
                  {jobs.map((j) => (
                    <tr key={j._id} className="hover:bg-[#faf8f5]/60 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-foreground">
                        <Link href={`/jobs/${j._id}`} className="hover:text-[#fabf28] transition-colors">
                          {j.title}
                        </Link>
                        <span className="block text-[11px] text-muted-foreground font-normal mt-0.5">
                          {formatServiceType(j.serviceType)} • {j.location?.city}, {j.location?.state}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-muted-foreground font-medium">
                        {j.companyId?.name || "Client"}
                      </td>

                      <td className="py-4 px-4">
                        {j.assignedPilotId ? (
                          <span className="text-foreground font-semibold">{j.assignedPilotId.name}</span>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">Unassigned ({j.applicationsCount || 0} proposals)</span>
                        )}
                      </td>

                      <td className="py-4 px-4 font-extrabold text-foreground font-mono">
                        {formatCurrency(j.budget)}
                      </td>

                      <td className="py-4 px-4 text-muted-foreground">
                        {formatDate(j.date)}
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={j.status} type="job" />
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Button asChild variant="secondary" size="sm" className="rounded-full h-8 text-xs px-3.5 border border-border dark:border-zinc-800 font-semibold">
                          <Link href={`/jobs/${j._id}`}>Inspect</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
