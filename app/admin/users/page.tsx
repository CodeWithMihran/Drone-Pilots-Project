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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Platform Governance & Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            User Account Registry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Monitor operator accounts, audit authorization levels, and enforce compliance standards across all platform members.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <Users className="w-4 h-4 text-primary" />
          <span>Active Registry: {users.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mr-1">Role:</span>
            <div className="flex flex-wrap gap-1 p-1 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
              {["ALL", "PILOT", "COMPANY", "ADMIN"].map((r) => {
                const active = roleFilter === r;
                return (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1 rounded-control text-xs font-semibold transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "ALL" ? "All Roles" : r === "PILOT" ? "Pilots" : r === "COMPANY" ? "Companies" : "Admins"}
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-border dark:bg-zinc-800 mx-1 hidden sm:block" />

            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mr-1 ml-1">Status:</span>
            <div className="flex flex-wrap gap-1 p-1 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
              {["ALL", "ACTIVE", "SUSPENDED"].map((s) => {
                const active = statusFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1 rounded-control text-xs font-semibold transition-all ${
                      active
                        ? "bg-foreground text-background shadow-xs"
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
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
              placeholder="Search accounts by name, email, or city..."
              className="pl-9 h-10 bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800 text-xs"
            />
          </div>
          <Button
            onClick={fetchUsers}
            variant="primary"
            size="sm"
            className="px-5 shrink-0 h-10"
          >
            Filter
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border dark:border-zinc-800/80 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account Registry ({users.length})
          </span>
        </div>
        <div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-surface-2 dark:bg-zinc-900 rounded-control animate-pulse border border-border dark:border-zinc-800" />
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
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border dark:border-zinc-800 bg-surface-2/60 dark:bg-zinc-900/60 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Base Location</th>
                    <th className="py-3 px-4">Member Since</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-zinc-800/80">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-surface-2/40 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-foreground block">{u.name}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">{u.email}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="text-[10px] uppercase font-mono border-border dark:border-zinc-800">
                          {u.role}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground">
                        {u.location?.city ? `${u.location.city}, ${u.location.state}` : "N/A"}
                      </td>

                      <td className="py-3.5 px-4 text-subtle">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={u.status} type="user" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {u.role !== "ADMIN" && (
                          <Button
                            onClick={() => handleToggleStatus(u._id, u.status)}
                            disabled={updating === u._id}
                            variant={u.status === "ACTIVE" ? "danger" : "secondary"}
                            size="sm"
                            className="text-[11px] h-7 px-2.5"
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
