"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  Receipt,
  Download,
  Building,
  ShieldCheck,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";

export default function PilotEarningsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/payments/my");
        if (res.ok) {
          const data = await res.json();
          setPayments(data.payments || []);
          setTotalEarnings(data.totalEarnings || 0);
          setPendingEarnings(data.pendingEarnings || 0);
        }
      } catch (err) {
        console.error("Failed to load earnings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Financial Operations & Escrow
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Pilot Earnings & Payout Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Automated direct deposit revenues, milestone escrow release status, and verified transaction receipts.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground px-3.5 py-2 rounded-control bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span>Automated Stripe Escrow Release</span>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Total Paid Earnings"
          value={formatCurrency(totalEarnings)}
          subtitle="Processed to bank account"
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Pending Escrow"
          value={formatCurrency(pendingEarnings)}
          subtitle="Secured for active flights"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Completed Payouts"
          value={payments.filter((p) => p.status === "PAID").length}
          subtitle="All-time fulfilled contracts"
          icon={CheckCircle2}
          variant="cyan"
        />
      </div>

      {/* Payments History Table */}
      <div className="p-6 sm:p-7 rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border dark:border-zinc-800/80">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              Payout Transaction Ledger
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Detailed chronological record of verified commercial payouts.
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground px-3 py-1 bg-surface-2 dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-control">
            {payments.length} Records
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-2 dark:bg-zinc-900/60 rounded-control animate-pulse border border-border dark:border-zinc-800" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No Payment History"
            description="You have not received payouts yet. Once you complete assigned flight operations, verified milestone releases will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-border dark:border-zinc-800 text-muted-foreground font-semibold">
                  <th className="py-3 px-3">Mission & Sector</th>
                  <th className="py-3 px-3">Client Organization</th>
                  <th className="py-3 px-3">Transaction ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-zinc-800/80">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-2/60 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-4 px-3 font-semibold text-foreground">
                      {p.jobId?.title || "Flight Operation"}
                      <span className="block text-[11px] text-primary font-medium mt-0.5">
                        {p.jobId?.serviceType?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-muted-foreground font-medium">
                      {p.companyId?.name || "Client"}
                    </td>
                    <td className="py-4 px-3 font-mono text-[11px] text-muted-foreground">
                      {p.transactionId}
                    </td>
                    <td className="py-4 px-3 text-muted-foreground">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="py-4 px-3 font-semibold text-success text-sm font-mono">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-4 px-3 text-right">
                      <StatusBadge status={p.status} type="payment" />
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