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
    <div className="space-y-6 max-w-6xl">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Enterprise Client Directory
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Organizations, procurement entities, and commercial tender publishers.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchCompanies();
            }}
            className="flex gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies by legal name, sector, or city..."
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
            <Card
              key={c._id}
              className="flex flex-col justify-between hover:border-border-strong transition-all"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-control bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {c.profile?.companyName ? c.profile.companyName.charAt(0) : "C"}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{c.profile?.companyName || c.name}</h3>
                    <p className="text-xs text-primary font-medium">{c.profile?.industry || "Commercial Services"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-subtle" />
                      {c.location?.city || "Station Base"}, {c.location?.state}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {c.profile?.description || "Industrial flight client."}
                </p>
              </CardContent>

              <div className="p-6 pt-0 border-t border-border flex items-center justify-between text-xs pt-4 mt-auto">
                <span className="text-muted-foreground">
                  Posted Missions: <strong className="text-foreground">{c.totalJobsPosted || 0}</strong>
                </span>
                <Badge variant="success" className="text-[10px]">
                  Verified Account
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
