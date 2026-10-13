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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Pilot Earnings & Escrow Payouts</h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Direct deposit flight revenues, completed contracts, and escrow transaction records.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Paid Earnings"
          value={formatCurrency(totalEarnings)}
          subtitle="Processed payouts"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Pending Escrow"
          value={formatCurrency(pendingEarnings)}
          subtitle="Assigned active projects"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Paid Contracts"
          value={payments.filter((p) => p.status === "PAID").length}
          subtitle="Completed payouts"
          icon={CheckCircle2}
          color="cyan"
        />
      </div>

      {/* Payments History Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            Payout Transaction History
          </h3>
          <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-secondary rounded-full">
            {payments.length} records
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-secondary/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No Payment History"
            description="You have not received payouts yet. Once you complete assigned projects, payments will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-semibold">
                  <th className="pb-3 pt-2 pl-2">Project & Industry</th>
                  <th className="pb-3 pt-2">Client Organization</th>
                  <th className="pb-3 pt-2">Transaction ID</th>
                  <th className="pb-3 pt-2">Date</th>
                  <th className="pb-3 pt-2">Amount</th>
                  <th className="pb-3 pt-2 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 pl-2 font-semibold text-foreground">
                      {p.jobId?.title || "Flight Operation"}
                      <span className="block text-[11px] text-primary/80 font-bold uppercase tracking-wider mt-0.5">
                        {p.jobId?.serviceType?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground font-medium">
                      {p.companyId?.name || "Client"}
                    </td>
                    <td className="py-4 font-mono text-[12px] text-muted-foreground">
                      {p.transactionId}
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="py-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-4 text-right pr-2">
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