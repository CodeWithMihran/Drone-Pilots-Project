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
import { Input } from "@/components/ui/input";

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
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              COMPLIANCE AUDIT
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            License Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Validate commercial remote pilot credentials against FAA and international aviation authority registries.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-border dark:border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-[#fabf28]" />
          <span>Part 107 Audit Console</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-border dark:border-zinc-800">
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
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  active
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by pilot name, license ID, or certificate authority..."
            className="pl-10 h-11 rounded-full text-xs bg-surface dark:bg-zinc-900 border-border dark:border-zinc-800"
          />
        </div>
      </div>

      {/* Certifications Table */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-border/80 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
            REVIEW QUEUE ({filtered.length})
          </h2>
          <span className="text-xs text-muted-foreground font-medium">Official Registry Cross-Check</span>
        </div>

        <div>
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse border border-border/60 dark:border-zinc-800" />
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
                  <tr className="border-b border-border dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/40 text-muted-foreground font-semibold">
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Pilot Details</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Authority & Type</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">License ID</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Validity</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Evidence</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Status</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80 dark:divide-zinc-800/80">
                  {filtered.map((cert) => (
                    <tr key={cert._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-4 px-4">
                        <Link
                          href={`/pilots/${cert.pilotId?._id}`}
                          className="font-bold text-foreground hover:text-[#fabf28] block"
                        >
                          {cert.pilotId?.name || "Pilot Account"}
                        </Link>
                        <span className="text-[11px] text-muted-foreground">
                          {cert.pilotId?.email}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-semibold text-foreground">
                        {cert.type}
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-[#fabf28]">
                        {cert.number}
                      </td>

                      <td className="py-4 px-4 text-muted-foreground">
                        <span>Issued: {formatDate(cert.issueDate)}</span>
                        <span className="block text-[11px] text-muted-foreground">
                          Expires: {formatDate(cert.expiryDate)}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {cert.documentUrl ? (
                          <Button asChild variant="secondary" size="sm" className="rounded-full px-4 h-8 border border-border dark:border-zinc-800 text-xs font-semibold active:scale-[0.98]">
                            <a
                              href={cert.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>View Doc</span>
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">No file</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <StatusBadge status={cert.status} type="certification" />
                      </td>

                      <td className="py-4 px-4 text-right">
                        {cert.status === "PENDING" && (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              disabled={actionLoading === cert._id}
                              onClick={() => handleApprove(cert._id)}
                              className="rounded-full px-4 h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-[0.98]"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={actionLoading === cert._id}
                              onClick={() => {
                                setSelectedCertId(cert._id);
                                setRejectModalOpen(true);
                              }}
                              className="rounded-full px-4 h-8 text-xs font-semibold active:scale-[0.98]"
                            >
                              Reject
                            </Button>
                          </div>
                        )}

                        {cert.status === "VERIFIED" && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                            Verified ✓
                          </span>
                        )}

                        {cert.status === "REJECTED" && (
                          <span className="text-xs text-rose-500 font-semibold">
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
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161b22] border border-border dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-5 text-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border dark:border-zinc-800">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-500" />
                Reject License Submission
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Provide feedback explaining why this credential was not validated (e.g. illegible certificate document, mismatch with federal registry, or expired dates).
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Reason for Rejection
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. License number was not found in the FAA Airmen Registry, or document image is illegible."
                  className="w-full p-3.5 rounded-xl bg-surface dark:bg-zinc-900 border border-border dark:border-zinc-800 text-foreground text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 rounded-full h-10 text-xs font-semibold"
                  onClick={() => setRejectModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="flex-1 rounded-full h-10 text-xs font-bold"
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
