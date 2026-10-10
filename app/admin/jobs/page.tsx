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
    <div className="space-y-6 max-w-6xl">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Platform Operations & Tenders
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Audit industrial job postings, monitor procurement status, and verify contract escrow assignments.
        </p>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
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
                  className={`px-3 py-1 rounded-control text-xs font-semibold transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
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
                className="pl-9"
              />
            </div>
            <Button
              onClick={fetchJobs}
              variant="primary"
              size="sm"
              className="px-5 shrink-0"
            >
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Flight Contracts Registry ({jobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-surface-2 rounded-control animate-pulse border border-border" />
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
                  <tr className="border-b border-border bg-surface-2/50 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Mission Title & Sector</th>
                    <th className="py-3 px-4">Client Organization</th>
                    <th className="py-3 px-4">Assigned Operator</th>
                    <th className="py-3 px-4">Contract Budget</th>
                    <th className="py-3 px-4">Flight Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {jobs.map((j) => (
                    <tr key={j._id} className="hover:bg-surface-2/60 transition-colors">
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
        </CardContent>
      </Card>
    </div>
  );
}
