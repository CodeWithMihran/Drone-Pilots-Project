"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Building,
  Briefcase,
  FileCheck2,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const stats = data?.stats || {
    totalUsers: 0,
    totalPilots: 0,
    totalCompanies: 0,
    pendingCertifications: 0,
    verifiedPilots: 0,
    activeJobs: 0,
    completedJobs: 0,
    applicationsCount: 0,
    totalPlatformVolume: 0,
  };

  const charts = data?.charts || {
    userDistribution: [],
    jobsByService: [],
    jobsByStatus: [],
    monthlyActivity: [],
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#180e38] via-[#0c142b] to-[#070e22] border border-purple-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Marketplace Control Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Oversee FAA Part 107 regulatory compliance, flight contract volume, pilot verification queue, and user accounts.
          </p>
        </div>

        <Link
          href="/admin/certifications"
          className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verification Queue ({stats.pendingCertifications})</span>
        </Link>
      </div>

      {/* Pending Verifications Warning Banner */}
      {stats.pendingCertifications > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>{stats.pendingCertifications} Pilot {stats.pendingCertifications === 1 ? "certificate is" : "certificates are"} awaiting verification.</strong> Review license records to activate pilot badges.
            </span>
          </div>
          <Link
            href="/admin/certifications"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shrink-0"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* 8 Real Database KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Platform accounts"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Commercial Pilots"
          value={stats.totalPilots}
          subtitle={`${stats.verifiedPilots} verified`}
          icon={ShieldCheck}
          color="cyan"
        />
        <StatCard
          title="Companies"
          value={stats.totalCompanies}
          subtitle="Enterprise clients"
          icon={Building}
          color="blue"
        />
        <StatCard
          title="Pending Certs"
          value={stats.pendingCertifications}
          subtitle="Awaiting review"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Active Missions"
          value={stats.activeJobs}
          subtitle="Open & in progress"
          icon={Clock}
          color="cyan"
        />
        <StatCard
          title="Completed Flights"
          value={stats.completedJobs}
          subtitle="Finished contracts"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Proposals Filed"
          value={stats.applicationsCount}
          subtitle="Total pilot bids"
          icon={FileCheck2}
          color="purple"
        />
        <StatCard
          title="Platform Volume"
          value={formatCurrency(stats.totalPlatformVolume)}
          subtitle="Simulated escrow"
          icon={DollarSign}
          color="emerald"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution Donut */}
        <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            User Distribution by Role
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {charts.userDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#070e22",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
            {charts.userDistribution.map((item: any) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                <span>{item.name}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Platform Activity */}
        <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Monthly Flight Volume & Bids
          </h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyActivity}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#070e22",
                    borderColor: "#334155",
                    borderRadius: "0.75rem",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="jobs" name="Projects Posted" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="applications" name="Pilot Applications" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>Projects Posted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Pilot Applications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs by Service Type breakdown */}
      <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Marketplace Demand by Industry Sector
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {charts.jobsByService.map((srv: any) => (
            <div key={srv.name} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-lg font-black text-cyan-400">{srv.count}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{srv.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
