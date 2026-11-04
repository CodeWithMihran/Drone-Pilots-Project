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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              USER GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            User Account Registry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Monitor operator accounts, audit authorization levels, and enforce compliance standards across all platform members.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
          <Users className="w-4 h-4 text-[#fabf28]" />
          <span>Active Registry: {users.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider mr-1">Role:</span>
            <div className="flex flex-wrap gap-1 p-1 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
              {["ALL", "PILOT", "COMPANY", "ADMIN"].map((r) => {
                const active = roleFilter === r;
                return (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      active
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "ALL" ? "All Roles" : r === "PILOT" ? "Pilots" : r === "COMPANY" ? "Companies" : "Admins"}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-border dark:bg-zinc-800 mx-1 hidden sm:block" />

            <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider mr-1 ml-1">Status:</span>
            <div className="flex flex-wrap gap-1 p-1 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
              {["ALL", "ACTIVE", "SUSPENDED"].map((s) => {
                const active = statusFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      active
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s === "ALL" ? "All Statuses" : s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
              placeholder="Search accounts by name, email, or city..."
              className="pl-10 h-11 rounded-full bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
            />
          </div>
          <Button
            onClick={fetchUsers}
            className="rounded-full px-7 h-11 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs shrink-0"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white dark:bg-[#121214] border border-border/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border/80 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
            ACCOUNT REGISTRY ({users.length})
          </span>
        </div>
        <div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-surface-2 dark:bg-zinc-850 rounded-2xl animate-pulse border border-border/60 dark:border-zinc-800" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Users}
                title="No accounts found"
                description="No users matched your filter criteria."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border dark:border-zinc-800 bg-[#faf8f5]/60 dark:bg-zinc-900/60 text-muted-foreground font-semibold">
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">User Details</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Role</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Base Location</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Member Since</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Account Status</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px] text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80 dark:divide-zinc-800/80">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-[#faf8f5]/60 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-bold text-foreground block">{u.name}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">{u.email}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800 text-[10px] font-bold uppercase font-mono">
                          {u.role}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-muted-foreground">
                        {u.location?.city ? `${u.location.city}, ${u.location.state}` : "N/A"}
                      </td>

                      <td className="py-4 px-4 text-muted-foreground">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={u.status} type="user" />
                      </td>

                      <td className="py-4 px-4 text-right">
                        {u.role !== "ADMIN" && (
                          <Button
                            onClick={() => handleToggleStatus(u._id, u.status)}
                            disabled={updating === u._id}
                            variant={u.status === "ACTIVE" ? "destructive" : "secondary"}
                            size="sm"
                            className="rounded-full text-[11px] h-8 px-3.5 font-semibold"
                          >
                            {u.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                          </Button>
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
    </div>
  );
}
