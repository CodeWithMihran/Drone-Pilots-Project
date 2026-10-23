"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Commercial Operations & Procurement
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Platform Tenders & Contracts
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Audit industrial job postings, monitor procurement lifecycles, and track contract escrow assignments across commercial sectors.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <Briefcase className="w-4 h-4 text-primary" />
          <span>Total Operations: {jobs.length}</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap gap-1.5 p-1 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          {[
            { label: "All Tenders", val: "ALL" },
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
                className={`px-3.5 py-1.5 rounded-control text-xs font-semibold transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-xs"
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
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              placeholder="Search by mission title, city, or client organization..."
              className="pl-9 h-10 bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
            />
          </div>
          <Button
            onClick={fetchJobs}
            variant="primary"
            size="sm"
            className="px-5 shrink-0 h-10"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border dark:border-zinc-800/80 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Flight Contracts Registry ({jobs.length})
          </span>
        </div>
        <div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-surface-2 dark:bg-zinc-900 rounded-control animate-pulse border border-border dark:border-zinc-800" />
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
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border dark:border-zinc-800 bg-surface-2/60 dark:bg-zinc-900/60 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Mission Title & Sector</th>
                    <th className="py-3 px-4">Client Organization</th>
                    <th className="py-3 px-4">Assigned Operator</th>
                    <th className="py-3 px-4">Contract Budget</th>
                    <th className="py-3 px-4">Flight Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-zinc-800/80">
                  {jobs.map((j) => (
                    <tr key={j._id} className="hover:bg-surface-2/40 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        <Link href={`/jobs/${j._id}`} className="hover:text-primary transition-colors">
                          {j.title}
                        </Link>
                        <span className="block text-[11px] text-muted-foreground font-normal">
                          {formatServiceType(j.serviceType)} • {j.location?.city}, {j.location?.state}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground font-medium">
                        {j.companyId?.name || "Client"}
                      </td>

                      <td className="py-3.5 px-4">
                        {j.assignedPilotId ? (
                          <span className="text-foreground font-medium">{j.assignedPilotId.name}</span>
                        ) : (
                          <span className="text-subtle text-[11px]">Unassigned ({j.applicationsCount || 0} proposals)</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-foreground font-mono">
                        {formatCurrency(j.budget)}
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground">
                        {formatDate(j.date)}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={j.status} type="job" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button asChild variant="secondary" size="sm" className="h-7 text-[11px] px-2.5">
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
