"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
  Filter,
  User,
  Search,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCertId, setSelectedCertId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/certifications?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setCertifications(data.certifications || []);
      }
    } catch (err) {
      console.error("Failed to load certifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, [statusFilter]);

  const handleApprove = async (certId: string) => {
    try {
      setActionLoading(certId);
      const res = await fetch(`/api/certifications/${certId}/verify`, {
        method: "PUT",
      });
      if (res.ok) fetchCertifications();
    } catch (err) {
      console.error("Approval error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(selectedCertId);
      const res = await fetch(`/api/certifications/${selectedCertId}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason }),
      });
      if (res.ok) {
        setRejectModalOpen(false);
        setRejectionReason("");
        fetchCertifications();
      }
    } catch (err) {
      console.error("Rejection error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = certifications.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.pilotId?.name?.toLowerCase().includes(q) ||
      c.number?.toLowerCase().includes(q) ||
      c.type?.toLowerCase().includes(q)
    );
  });

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
              Aviation Compliance Governance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            License Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Validate commercial remote pilot credentials against FAA and international aviation authority registries.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Part 107 Audit Console</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap gap-1.5 p-1 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          {[
            { label: "Pending Verification", val: "PENDING" },
            { label: "Verified Credentials", val: "VERIFIED" },
            { label: "Rejected Submissions", val: "REJECTED" },
            { label: "Expired Licenses", val: "EXPIRED" },
            { label: "All Submissions", val: "ALL" },
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

        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by pilot name, license ID, or certificate authority..."
            className="pl-10 text-xs bg-surface-2 dark:bg-zinc-900 border-border dark:border-zinc-800"
          />
        </div>
      </div>

      {/* Certifications Table */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border dark:border-zinc-800/80 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Review Queue ({filtered.length})
          </h2>
          <span className="text-xs text-muted-foreground">Showing verified records</span>
        </div>

        <div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-surface-2 dark:bg-zinc-900/60 rounded-control animate-pulse border border-border dark:border-zinc-800" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={ShieldCheck}
                title="No submissions in this queue"
                description="There are currently no pilot certifications matching your filter criteria."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border dark:border-zinc-800 bg-surface-2/40 dark:bg-zinc-900/40 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Pilot Details</th>
                    <th className="py-3 px-4">Authority & Type</th>
                    <th className="py-3 px-4">License ID</th>
                    <th className="py-3 px-4">Validity</th>
                    <th className="py-3 px-4">Evidence</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border dark:divide-zinc-800/80">
                  {filtered.map((cert) => (
                    <tr key={cert._id} className="hover:bg-surface-2/50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/pilots/${cert.pilotId?._id}`}
                          className="font-semibold text-foreground hover:text-primary block"
                        >
                          {cert.pilotId?.name || "Pilot Account"}
                        </Link>
                        <span className="text-[11px] text-muted-foreground">
                          {cert.pilotId?.email}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-foreground">
                        {cert.type}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-primary">
                        {cert.number}
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground">
                        <span>Issued: {formatDate(cert.issueDate)}</span>
                        <span className="block text-[11px] text-muted-foreground">
                          Expires: {formatDate(cert.expiryDate)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {cert.documentUrl ? (
                          <Button asChild variant="secondary" size="sm" className="active:scale-[0.98]">
                            <a
                              href={cert.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="gap-1 text-xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>View Doc</span>
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">No file</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={cert.status} type="certification" />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {cert.status === "PENDING" && (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              disabled={actionLoading === cert._id}
                              onClick={() => handleApprove(cert._id)}
                              className="bg-success text-white hover:bg-success/90 h-8 active:scale-[0.98]"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={actionLoading === cert._id}
                              onClick={() => {
                                setSelectedCertId(cert._id);
                                setRejectModalOpen(true);
                              }}
                              className="h-8 active:scale-[0.98]"
                            >
                              Reject
                            </Button>
                          </div>
                        )}

                        {cert.status === "VERIFIED" && (
                          <span className="text-[11px] text-success font-semibold">
                            Verified ✓
                          </span>
                        )}

                        {cert.status === "REJECTED" && (
                          <span className="text-[11px] text-destructive font-medium">
                            Rejected
                          </span>
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

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-panel bg-surface dark:bg-zinc-950 border border-border dark:border-zinc-800 shadow-2xl p-6 sm:p-7 space-y-4 text-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" />
                Reject License Submission
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1 rounded-control hover:bg-surface-2 dark:hover:bg-zinc-900"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Provide feedback for the pilot explaining why their credential was not approved (e.g. unreadable scan, mismatching registry name, or expired license).
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Reason for Rejection
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. License number was not found in the FAA Airmen Registry, or document image is illegible."
                  className="w-full p-3 rounded-control bg-surface border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setRejectModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  className="flex-1"
                  disabled={actionLoading === selectedCertId}
                >
                  {actionLoading === selectedCertId ? "Rejecting..." : "Confirm Rejection"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
