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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pilot Earnings & Escrow Payouts</h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct deposit flight revenues, completed contracts, and escrow transaction records.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-cyan-400" />
            Payout Transaction History
          </h3>
          <span className="text-xs text-slate-400">{payments.length} total records</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />
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
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 pl-2">Project & Industry</th>
                  <th className="pb-3">Client Organization</th>
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 pl-2 font-semibold text-white">
                      {p.jobId?.title || "Flight Operation"}
                      <span className="block text-[10px] text-cyan-400 font-normal">
                        {p.jobId?.serviceType?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-300">
                      {p.companyId?.name || "Client"}
                    </td>
                    <td className="py-3.5 font-mono text-[11px] text-slate-400">
                      {p.transactionId}
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="py-3.5 font-bold text-emerald-400">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-3.5 text-right pr-2">
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
