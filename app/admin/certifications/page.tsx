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
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            License Verification Queue
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Validate commercial remote pilot credentials against FAA and international aviation records.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
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
                  className={`px-3 py-1.5 rounded-control text-xs font-semibold transition-colors ${
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

          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pilot name, license ID, or certificate authority..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Certifications Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Review Queue ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-surface-2 rounded-control animate-pulse border border-border" />
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
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-2/50 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Pilot Details</th>
                    <th className="py-3 px-4">Authority & Type</th>
                    <th className="py-3 px-4">License ID</th>
                    <th className="py-3 px-4">Validity</th>
                    <th className="py-3 px-4">Evidence</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((cert) => (
                    <tr key={cert._id} className="hover:bg-surface-2/60 transition-colors">
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
                        <span className="block text-[11px] text-subtle">
                          Expires: {formatDate(cert.expiryDate)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {cert.documentUrl ? (
                          <Button asChild variant="secondary" size="sm">
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
                          <span className="text-subtle text-[11px]">No file</span>
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
                              className="bg-success text-white hover:bg-success/90"
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
        </CardContent>
      </Card>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-panel bg-surface border border-border shadow-2xl p-6 space-y-4 text-foreground">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <XCircle className="w-4 h-4 text-destructive" />
                Reject License Submission
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
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
