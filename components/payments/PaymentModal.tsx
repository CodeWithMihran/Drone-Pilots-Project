"use client";

import React, { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  Building,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  X,
  Lock,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  pilot?: any;
}

export function PaymentModal({ isOpen, onClose, job, pilot }: PaymentModalProps) {
  const [gatewayNotice, setGatewayNotice] = useState(false);

  if (!isOpen || !job) return null;

  const assignedPilot = pilot || job.assignedPilotId || {};
  const payableAmount = job.agreedAmount || job.budget || 0;
  const missionId = job._id ? job._id.toString() : "";
  const shortId = missionId ? `#${missionId.slice(-6).toUpperCase()}` : "";

  const handleProceed = () => {
    setGatewayNotice(true);
  };

  const handleClose = () => {
    setGatewayNotice(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
                PAYOUT AUTHORIZATION
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Pay Pilot for Completed Mission
            </h3>
            <p className="text-xs text-muted-foreground">
              Review agreed milestone figures and authorize payout for verified flight deliverables.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground hover:text-foreground flex items-center justify-center text-xs font-bold transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Temporary Gateway Message Banner */}
        {gatewayNotice && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Payment gateway integration will be available soon.</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-300/80 pl-6">
              The payment gateway checkout will be configured for real-time disbursement. No transaction was charged.
            </p>
          </div>
        )}

        {/* Mission Details Section */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Mission Specifications
            </span>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-foreground">
              ID: {shortId || missionId}
            </span>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-bold text-foreground">
              {job.title}
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1.5">
              <span className="text-[#fabf28] font-bold">
                {formatServiceType(job.serviceType)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#fabf28]" />
                {job.location?.city}, {job.location?.state}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                {formatDate(job.date)}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Approval Status</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approved by Company
            </span>
          </div>
        </div>

        {/* Pilot Details Section */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
            Payee & Assigned Operator
          </span>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#fabf28]/20 text-zinc-950 dark:text-[#fabf28] flex items-center justify-center font-bold text-sm shrink-0">
              {assignedPilot.name ? assignedPilot.name.charAt(0).toUpperCase() : "P"}
            </div>
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-foreground truncate">
                  {assignedPilot.name || "Assigned Pilot"}
                </h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Pilot
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {assignedPilot.email || "Registered AeroLink Pilot"}
                {assignedPilot.phone ? ` • ${assignedPilot.phone}` : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-5 rounded-2xl bg-zinc-950 dark:bg-black text-white space-y-3.5 border border-zinc-800">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Payment Summary
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400">
              <Clock className="w-3 h-3" />
              {job.paymentStatus === "PAID" ? "Completed" : "Pending Release"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-zinc-300">
              <span>Agreed Proposal Fee:</span>
              <span className="font-mono font-bold text-white">{formatCurrency(payableAmount)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Escrow Security & Verification:</span>
              <span className="font-mono text-emerald-400 font-semibold">$0.00 (Included)</span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
              <div>
                <span className="text-xs font-bold text-white block">Total Payout Amount:</span>
                <span className="text-[10px] text-zinc-400 font-mono">Disbursed directly to pilot</span>
              </div>
              <span className="text-2xl font-extrabold text-[#fabf28] font-mono">
                {formatCurrency(payableAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold"
          >
            Cancel
          </Button>
          <Button
            id="proceed-to-payment-btn"
            type="button"
            onClick={handleProceed}
            className="flex-1 h-12 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs tracking-tight shadow-md transition-all active:scale-[0.98] gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Proceed to Payment</span>
          </Button>
        </div>

        <div className="text-center">
          <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 font-medium">
            <Lock className="w-3 h-3 text-emerald-500" />
            Underwritten Milestone Escrow Protection
          </span>
        </div>
      </div>
    </div>
  );
}
