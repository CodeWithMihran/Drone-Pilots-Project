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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pilot Certification Verification Queue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Validate commercial drone licenses, FAA Part 107 credentials, and grant verified pilot status.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-3">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Pending Verification", val: "PENDING" },
            { label: "Verified Credentials", val: "VERIFIED" },
            { label: "Rejected Submissions", val: "REJECTED" },
            { label: "Expired Licenses", val: "EXPIRED" },
            { label: "All Submissions", val: "ALL" },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setStatusFilter(tab.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === tab.val
                  ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by pilot name, license number, or certificate authority..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Certifications Table */}
      <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No Certifications in this Queue"
            description="There are currently no pilot certifications matching your filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Pilot Details</th>
                  <th className="pb-3">Certificate Type</th>
                  <th className="pb-3">License Number</th>
                  <th className="pb-3">Validity Window</th>
                  <th className="pb-3">Document</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 pl-2">
                      <Link
                        href={`/pilots/${cert.pilotId?._id}`}
                        className="font-bold text-white hover:text-cyan-300 block"
                      >
                        {cert.pilotId?.name || "Pilot"}
                      </Link>
                      <span className="text-[10px] text-slate-400">
                        {cert.pilotId?.email}
                      </span>
                    </td>

                    <td className="py-3.5 font-medium text-slate-200">
                      {cert.type}
                    </td>

                    <td className="py-3.5 font-mono text-cyan-300 font-bold">
                      {cert.number}
                    </td>

                    <td className="py-3.5 text-slate-400">
                      <span>{formatDate(cert.issueDate)}</span>
                      <span className="block text-[10px] text-slate-500">
                        Expires: {formatDate(cert.expiryDate)}
                      </span>
                    </td>

                    <td className="py-3.5">
                      {cert.documentUrl ? (
                        <a
                          href={cert.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          View Doc
                        </a>
                      ) : (
                        <span className="text-slate-500">No doc</span>
                      )}
                    </td>

                    <td className="py-3.5">
                      <StatusBadge status={cert.status} type="certification" />
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        {cert.status !== "VERIFIED" && (
                          <button
                            id={`approve-cert-btn-${cert._id}`}
                            onClick={() => handleApprove(cert._id)}
                            disabled={actionLoading === cert._id}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {cert.status !== "REJECTED" && (
                          <button
                            id={`reject-cert-btn-${cert._id}`}
                            onClick={() => {
                              setSelectedCertId(cert._id);
                              setRejectionReason("");
                              setRejectModalOpen(true);
                            }}
                            disabled={actionLoading === cert._id}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 font-semibold text-xs transition"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0c142b] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                Reject Pilot Certification
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Provide a reason that will be sent directly to the pilot.
              </p>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Rejection Feedback
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. The license number could not be validated on the FAA pilot registry or document was unreadable..."
                  className="w-full p-3 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  id="confirm-reject-cert-btn"
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-md"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
