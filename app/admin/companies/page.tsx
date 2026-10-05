"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building, Search, Briefcase, MapPin, Globe } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Enterprise Client Directory</h1>
        <p className="text-xs text-slate-400 mt-1">
          Organizations, procurement entities, and commercial tender publishers.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#0c142b] border border-slate-800/80 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCompanies();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies by name, industry, or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-md"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800 animate-pulse h-44" />
          ))
        ) : companies.length === 0 ? (
          <div className="col-span-3">
            <EmptyState
              icon={Building}
              title="No Companies Found"
              description="No company profiles matched your search."
            />
          </div>
        ) : (
          companies.map((c) => (
            <div
              key={c._id}
              className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-cyan-400 font-bold text-lg flex items-center justify-center shrink-0">
                    {c.profile?.companyName ? c.profile.companyName.charAt(0) : "C"}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{c.profile?.companyName || c.name}</h3>
                    <p className="text-xs text-cyan-400">{c.profile?.industry || "Commercial Services"}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {c.location?.city || "USA"}, {c.location?.state}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {c.profile?.description || "Commercial drone services client."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Total Tenders: <strong className="text-white">{c.totalJobsPosted || 0}</strong>
                </span>
                <span className="text-emerald-400 font-bold">Active Account</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
