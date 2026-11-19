"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Layers,
  MapPin,
  Calendar,
  DollarSign,
  PlusCircle,
  FileCheck2,
  ArrowRight,
  Trash2,
  CreditCard,
  Star,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/payments/PaymentModal";

export default function CompanyMyJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Payment Modal state
  const [selectedPaymentJob, setSelectedPaymentJob] = useState<any | null>(null);

  // Revision Modal state
  const [revisionModalJob, setRevisionModalJob] = useState<any | null>(null);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [submittingRevision, setSubmittingRevision] = useState(false);

  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const companyId = sessionData?.user?._id;

      if (companyId) {
        if (statusFilter === "PAYMENTS") {
          const pRes = await fetch("/api/payments/my");
          if (pRes.ok) {
            const pData = await pRes.json();
            setPayments(pData.payments || []);
          }
        } else {
          const res = await fetch(`/api/jobs?companyId=${companyId}&status=${statusFilter}`);
          if (res.ok) {
            const data = await res.json();
            setJobs(data.jobs || []);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load company jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, [statusFilter]);

  const handleApproveMission = async (jobId: string) => {
    try {
      setActionLoading(jobId);
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: "APPROVED" }),
      });
      if (res.ok) {
        fetchCompanyJobs();
      }
    } catch (err) {
      console.error("Approve mission error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionModalJob) return;

    try {
      setSubmittingRevision(true);
      const res = await fetch(`/api/jobs/${revisionModalJob._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalStatus: "REVISION_REQUESTED",
          revisionNotes: revisionNotes.trim() || "Deliverables revision requested by company.",
        }),
      });

      if (res.ok) {
        setRevisionModalJob(null);
        setRevisionNotes("");
        fetchCompanyJobs();
      }
    } catch (err) {
      console.error("Request revision error:", err);
    } finally {
      setSubmittingRevision(false);
    }
  };

  const handleCancelJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to cancel this mission brief?")) return;
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (res.ok) fetchCompanyJobs();
    } catch (err) {
      console.error("Cancel job error:", err);
    }
  };

  const awaitingPaymentJobs = jobs.filter(
    (j) => j.approvalStatus === "APPROVED" && j.paymentStatus !== "PAID"
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              MISSION MANAGEMENT
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            My Mission Briefs
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Track and oversee all commercial drone shoots, review pilot completion deliverables, approve milestones, and disburse payouts.
          </p>
        </div>

        <Button asChild className="h-10 px-6 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs self-start sm:self-auto shrink-0 active:scale-[0.98]">
          <Link href="/company/post-job" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            <span>Post a Mission</span>
          </Link>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-border dark:border-zinc-800">
        {[
          { label: "All Missions", val: "ALL" },
          { label: "Awaiting Payment", val: "AWAITING_PAYMENT", count: awaitingPaymentJobs.length },
          { label: "Open & Bidding", val: "OPEN" },
          { label: "Pilot Assigned", val: "PILOT_SELECTED" },
          { label: "In Flight", val: "IN_PROGRESS" },
          { label: "Completed", val: "COMPLETED" },
          { label: "Payment History", val: "PAYMENTS" },
          { label: "Cancelled", val: "CANCELLED" },
        ].map((tab) => (
          <button
            key={tab.val}
            onClick={() => setStatusFilter(tab.val)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === tab.val
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#fabf28] text-zinc-950 text-[10px] font-black flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-7 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs animate-pulse h-36" />
          ))}
        </div>
      ) : statusFilter === "PAYMENTS" ? (
        /* Payment Ledger View */
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-zinc-800">
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#fabf28]" />
                COMPANY PAYOUT TRANSACTION LEDGER
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Record of authorized and processed milestone disbursements to certified drone pilots.
              </p>
            </div>
            <span className="text-xs font-bold text-foreground px-3.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-border dark:border-zinc-800 rounded-full">
              {payments.length} Records
            </span>
          </div>

          {payments.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="No Payment Records"
              description="You have not released any payments yet. When completed missions are approved and disbursed, they will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border dark:border-zinc-800 text-muted-foreground font-semibold">
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Mission</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Assigned Pilot</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Transaction ID</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Date</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Amount</th>
                    <th className="py-3.5 px-4 font-mono uppercase text-[11px] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80 dark:divide-zinc-800/80">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-foreground">
                        {p.jobId?.title || "Mission Operation"}
                        <span className="block text-[11px] text-[#fabf28] font-semibold mt-0.5">
                          {p.jobId?.serviceType?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-foreground font-medium">
                        {p.pilotId?.name || "Verified Pilot"}
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] text-muted-foreground">
                        {p.transactionId}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-foreground text-sm font-mono">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <StatusBadge status={p.status} type="payment" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Missions Found"
          description="You do not have any mission briefs matching this filter."
          actionText="Post a Mission"
          actionHref="/company/post-job"
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isApproved = job.approvalStatus === "APPROVED";
            const isPendingReview = job.status === "COMPLETED" && job.approvalStatus === "PENDING";
            const isRevisionRequested = job.approvalStatus === "REVISION_REQUESTED";
            const isPaid = job.paymentStatus === "PAID";
            const isAwaitingPayment = isApproved && !isPaid;
            const agreedAmount = job.agreedAmount || job.budget;
            const shortId = job._id ? `#${job._id.slice(-6).toUpperCase()}` : "";

            return (
              <div
                key={job._id}
                className={`p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161b22] border shadow-xs space-y-5 transition-all duration-200 ${
                  isAwaitingPayment
                    ? "border-[#fabf28] dark:border-[#fabf28]/60 ring-1 ring-[#fabf28]/30"
                    : isPendingReview
                    ? "border-amber-400/80 dark:border-amber-500/50"
                    : "border-border/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-[#fabf28]/15 border border-[#fabf28]/25 text-zinc-950 dark:text-[#fabf28] text-[11px] font-bold">
                        {formatServiceType(job.serviceType)}
                      </span>
                      <StatusBadge status={job.status} type="job" />

                      {/* Approval Status Badge */}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                          <CheckCircle2 className="w-3 h-3" />
                          Deliverables Approved
                        </span>
                      )}
                      {isPendingReview && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                          <Clock className="w-3 h-3" />
                          Awaiting Your Approval
                        </span>
                      )}
                      {isRevisionRequested && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                          <RotateCcw className="w-3 h-3" />
                          Revision Requested
                        </span>
                      )}

                      {/* Payment Status Badge */}
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                          <ShieldCheck className="w-3 h-3" />
                          Paid
                        </span>
                      ) : isAwaitingPayment ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fabf28]/20 text-zinc-950 dark:text-[#fabf28] border border-[#fabf28]/40">
                          <Clock className="w-3 h-3" />
                          Pending Payment
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <Link href={`/jobs/${job._id}`}>
                        <h3 className="text-base sm:text-xl font-bold text-foreground hover:text-[#fabf28] transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                      </Link>
                      <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                        {shortId}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#fabf28]" />
                        {job.location?.city}, {job.location?.state}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        Shoot Date: {formatDate(job.date)}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-0.5">
                      {job.agreedAmount ? "Agreed Proposal Amount" : "Budget"}
                    </span>
                    <span className="text-xl sm:text-2xl font-extrabold text-foreground font-mono">
                      {formatCurrency(agreedAmount)}
                    </span>
                  </div>
                </div>

                {/* Pilot completion deliverables notice */}
                {isPendingReview && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        Pilot marked this mission as completed!
                      </p>
                      <p className="text-amber-800/80 dark:text-amber-300/70 text-[11px]">
                        {job.completionNotes || "Flight operations finished. Please review deliverable quality to approve payout."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleApproveMission(job._id)}
                        disabled={actionLoading === job._id}
                        className="rounded-full px-4 h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        <span>Approve Deliverables</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setRevisionModalJob(job);
                          setRevisionNotes("");
                        }}
                        className="rounded-full px-4 h-8 text-xs font-semibold"
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        <span>Request Revision</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Revision Requested Notice */}
                {isRevisionRequested && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-800 dark:text-rose-300">
                    <span className="font-bold">Revision Requested:</span> {job.revisionNotes || "Awaiting updated deliverables from pilot."}
                  </div>
                )}

                {/* Action Buttons & Pilot Info Bar */}
                <div className="pt-4 border-t border-border/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-muted-foreground font-medium space-y-0.5">
                    {job.assignedPilotId ? (
                      <div>
                        <span>Assigned Pilot: <strong className="text-foreground font-semibold">{job.assignedPilotId.name}</strong></span>
                        <span className="mx-2">•</span>
                        <span>Agreed: <strong className="text-foreground font-mono">{formatCurrency(agreedAmount)}</strong></span>
                        <span className="mx-2">•</span>
                        <span>Payment Status: <strong className={isPaid ? "text-emerald-500 font-bold" : isAwaitingPayment ? "text-amber-500 font-bold" : "text-muted-foreground"}>{isPaid ? "Paid" : isAwaitingPayment ? "Pending Payment" : "Unpaid"}</strong></span>
                      </div>
                    ) : (
                      <span>Accepting verified pilot proposals</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    {/* PAY PILOT BUTTON - Appears ONLY after company approval and when not paid */}
                    {isAwaitingPayment && (
                      <Button
                        id={`pay-pilot-btn-${job._id}`}
                        onClick={() => setSelectedPaymentJob(job)}
                        className="rounded-full px-5 h-9 bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs shadow-xs gap-1.5 active:scale-[0.98]"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Pilot ({formatCurrency(agreedAmount)})</span>
                      </Button>
                    )}

                    <Button asChild size="sm" className="rounded-full px-5 h-9 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-foreground font-bold text-xs w-full sm:w-auto active:scale-[0.98]">
                      <Link href={`/company/applications?jobId=${job._id}`} className="gap-1.5">
                        <FileCheck2 className="w-4 h-4" />
                        <span>Proposals</span>
                      </Link>
                    </Button>

                    <Button variant="secondary" size="sm" asChild className="rounded-full px-4 h-9 border border-border dark:border-zinc-800 text-xs font-semibold w-full sm:w-auto active:scale-[0.98]">
                      <Link href={`/jobs/${job._id}`}>
                        Brief Specs
                      </Link>
                    </Button>

                    {job.status !== "COMPLETED" && job.status !== "CANCELLED" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelJob(job._id)}
                        title="Cancel Job"
                        className="rounded-full px-4 h-9 text-xs active:scale-[0.98]"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        <span>Cancel</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Revision Request Modal */}
      {revisionModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Request Deliverable Revision</h3>
            <p className="text-xs text-muted-foreground">
              Provide feedback for <strong className="text-foreground">{revisionModalJob.assignedPilotId?.name || "the pilot"}</strong> regarding required adjustments:
            </p>

            <form onSubmit={handleRequestRevisionSubmit} className="space-y-4">
              <textarea
                required
                rows={4}
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="E.g., Please re-process orthomosaic with higher overlap or supply raw DNG files..."
                className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-foreground focus:outline-none focus:border-[#fabf28]"
              />

              <div className="flex gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setRevisionModalJob(null)}
                  className="flex-1 rounded-full text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingRevision}
                  className="flex-1 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs"
                >
                  {submittingRevision ? "Sending..." : "Submit Revision"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Interface Modal */}
      <PaymentModal
        isOpen={!!selectedPaymentJob}
        onClose={() => setSelectedPaymentJob(null)}
        job={selectedPaymentJob}
        pilot={selectedPaymentJob?.assignedPilotId}
      />
    </div>
  );
}
