"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Search, Star, MapPin, Eye, Plane } from "lucide-react";
import { StarRating } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Commercial Pilot Roster</h1>
        <p className="text-xs text-slate-400 mt-1">
          Aviation compliance audit, fleet specifications, and verified credential tracking.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-[#0c142b] border border-slate-800/80 shadow-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPilots();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pilot name, license, city, or equipment..."
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
        ) : pilots.length === 0 ? (
          <div className="col-span-3">
            <EmptyState
              icon={Plane}
              title="No Pilots Found"
              description="No pilot records match the current search."
            />
          </div>
        ) : (
          pilots.map((p) => (
            <div
              key={p._id}
              className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400">{p.email}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {p.location?.city}, {p.location?.state}
                    </p>
                  </div>
                  {p.isVerified ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      VERIFIED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400">
                      Standard
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-y border-slate-800">
                  <StarRating rating={p.profile?.rating || 5.0} totalReviews={p.profile?.totalReviews || 0} size="sm" />
                  <span className="text-slate-300 font-semibold">{p.profile?.experience || 1}+ yrs exp</span>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-300 block">Equipment:</span>
                  <p className="line-clamp-2">{p.profile?.equipment?.join(", ") || "Standard commercial aircraft"}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">${p.profile?.rate || 75}/hr</span>
                <Link
                  href={`/pilots/${p._id}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs transition"
                >
                  Inspect Profile
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
