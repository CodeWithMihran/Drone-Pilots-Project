"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  ShieldCheck,
  Building,
  User,
  ShieldAlert,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (!confirm(`Are you sure you want to change user status to ${nextStatus}?`)) return;

    try {
      setUpdating(userId);
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Status toggle error:", err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform User Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspect, manage permissions, and enforce compliance for all pilots, enterprise clients, and administrative staff.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-3">
        <div className="flex flex-wrap gap-2">
          {["ALL", "PILOT", "COMPANY", "ADMIN"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                roleFilter === r
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {r === "ALL" ? "All Roles" : r}
            </button>
          ))}
          <div className="h-6 w-px bg-slate-800 mx-1 self-center" />
          {["ALL", "ACTIVE", "SUSPENDED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === s
                  ? "bg-slate-700 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s === "ALL" ? "All Statuses" : s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
              placeholder="Search by name, email, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={fetchUsers}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Users Found"
            description="No users matched your filter criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">User Details</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Joined Date</th>
                  <th className="pb-3">Account Status</th>
                  <th className="pb-3 text-right pr-2">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 pl-2">
                      <span className="font-bold text-white block">{u.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                    </td>

                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-bold text-[10px]">
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 text-slate-300">
                      {u.location?.city ? `${u.location.city}, ${u.location.state}` : "N/A"}
                    </td>

                    <td className="py-3.5 text-slate-400">
                      {formatDate(u.createdAt)}
                    </td>

                    <td className="py-3.5">
                      <StatusBadge status={u.status} type="user" />
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      {u.role !== "ADMIN" && (
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status)}
                          disabled={updating === u._id}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition ${
                            u.status === "ACTIVE"
                              ? "bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25"
                              : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                          }`}
                        >
                          {u.status === "ACTIVE" ? "Suspend Account" : "Reactivate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
