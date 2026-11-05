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
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              PAYOUTS & REVENUE
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Earnings & Payout Ledger
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Automated direct deposit revenues, milestone escrow release status, and verified transaction receipts.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Milestone Escrow Protection</span>
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
          subtitle="All-time fulfilled shoots"
          icon={CheckCircle2}
          variant="gold"
        />
      </div>

      {/* Payments History Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/80 dark:border-zinc-800">
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#fabf28]" />
              PAYOUT TRANSACTION LEDGER
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Detailed chronological record of verified commercial payouts.
            </p>
          </div>
          <span className="text-xs font-bold text-foreground px-3.5 py-1 bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800 rounded-full">
            {payments.length} Records
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-surface-2 dark:bg-zinc-850 rounded-2xl animate-pulse border border-border/60 dark:border-zinc-800" />
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
                  <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Mission</th>
                  <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Client</th>
                  <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Transaction ID</th>
                  <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Date</th>
                  <th className="py-3.5 px-4 font-mono uppercase text-[11px]">Amount</th>
                  <th className="py-3.5 px-4 font-mono uppercase text-[11px] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/80 dark:divide-zinc-800/80">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-[#faf8f5]/60 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-foreground">
                      {p.jobId?.title || "Flight Operation"}
                      <span className="block text-[11px] text-[#fabf28] font-semibold mt-0.5">
                        {p.jobId?.serviceType?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground font-medium">
                      {p.companyId?.name || "Client"}
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

    </div>
  );
}
