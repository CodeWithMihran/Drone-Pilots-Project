"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  pilot?: any;
  onSuccess?: (payment?: any) => void;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const existingScript = document.getElementById("razorpay-checkout-js");
    if (existingScript) return resolve(true);

    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PaymentModal({ isOpen, onClose, job, pilot, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [successPayment, setSuccessPayment] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadRazorpayScript();
      setError("");
      setSuccessPayment(null);
    }
  }, [isOpen]);

  if (!isOpen || !job) return null;

  const assignedPilot = pilot || job.assignedPilotId || {};
  const payableAmount = job.agreedAmount || job.budget || 0;
  const missionId = job._id ? job._id.toString() : "";
  const shortId = missionId ? `#${missionId.slice(-6).toUpperCase()}` : "";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProceed = async () => {
    setError("");
    setLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error(
          "Unable to load Razorpay payment gateway. Please check your internet connection."
        );
      }

      // Step 1: Create Razorpay Order on server
      const orderRes = await fetch("/api/payments/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: missionId }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to initialize payment order.");
      }

      // Step 2: Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AeroLink Flight Network",
        description: `Mission Payout — ${job.title.slice(0, 45)}`,
        order_id: orderData.orderId,
        prefill: {
          name: (job.companyId as any)?.name || "Enterprise Client",
          email: (job.companyId as any)?.email || "",
          contact: (job.companyId as any)?.phone || "",
        },
        notes: {
          jobId: missionId,
          pilotId: (assignedPilot._id || assignedPilot).toString(),
        },
        theme: {
          color: "#fabf28",
          backdrop_color: "rgba(0, 0, 0, 0.8)",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // Step 3: Verify Razorpay signature and update database
          setVerifying(true);
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                jobId: missionId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            setSuccessPayment(verifyData.payment);
            if (onSuccess) {
              onSuccess(verifyData.payment);
            }
          } catch (verifyErr: any) {
            setError(verifyErr.message || "Failed to verify payment with server.");
          } finally {
            setVerifying(false);
            setLoading(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", function (resp: any) {
        console.error("Razorpay Payment Failed:", resp.error);
        setError(
          resp.error?.description || "Payment attempt failed. Please check credentials and try again."
        );
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Proceed payment error:", err);
      setError(err.message || "Something went wrong while initiating payment.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    setLoading(false);
    setVerifying(false);
    const wasSuccess = !!successPayment;
    setSuccessPayment(null);
    onClose();
    if (wasSuccess) {
      window.location.reload();
    }
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
              Authorize milestone disbursement via Razorpay gateway to the assigned pilot.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-muted-foreground hover:text-foreground flex items-center justify-center text-xs font-bold transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Confirmation View */}
        {successPayment ? (
          <div className="space-y-5 animate-fade-in">
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  Payment Released Successfully!
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  The milestone payout of{" "}
                  <strong className="text-foreground font-mono">{formatCurrency(payableAmount)}</strong>{" "}
                  has been paid to <strong className="text-foreground">{assignedPilot.name}</strong>.
                </p>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono font-bold text-foreground">
                  {successPayment.transactionId || successPayment.razorpayPaymentId}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-semibold text-foreground">Razorpay Gateway</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Paid
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground">Disbursed Amount</span>
                <span className="font-mono font-bold text-[#fabf28] text-sm">
                  {formatCurrency(payableAmount)}
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleClose}
              className="w-full h-11 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs"
            >
              Done & Close
            </Button>
          </div>
        ) : (
          <>
            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800/60 text-rose-900 dark:text-rose-200 text-xs space-y-1 animate-fade-in flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Payment Issue</p>
                  <p className="text-[11px] leading-relaxed text-rose-700/90 dark:text-rose-300/80">
                    {error}
                  </p>
                </div>
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
                  <span className="font-mono text-emerald-400 font-semibold">₹0 (Included)</span>
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

            {/* Test Credentials Quick Reference */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-750 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Test Payment Helper
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Razorpay Sandbox
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#161b22] border border-zinc-200/80 dark:border-zinc-800">
                  <span className="text-muted-foreground">Card:</span>
                  <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground">
                    <span>4100 2800 0000 1007</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("4100280000001007", "card")}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Copy card number"
                    >
                      {copiedField === "card" ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#161b22] border border-zinc-200/80 dark:border-zinc-800">
                  <span className="text-muted-foreground">UPI:</span>
                  <div className="flex items-center gap-1.5 font-mono font-semibold text-foreground">
                    <span>test@razorpay</span>
                    <button
                      type="button"
                      onClick={() => handleCopy("test@razorpay", "upi")}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Copy UPI ID"
                    >
                      {copiedField === "upi" ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                disabled={loading || verifying}
                onClick={handleClose}
                className="flex-1 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                id="proceed-to-payment-btn"
                type="button"
                disabled={loading || verifying}
                onClick={handleProceed}
                className="flex-1 h-12 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs tracking-tight shadow-md transition-all active:scale-[0.98] gap-2 disabled:opacity-50"
              >
                {loading || verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{verifying ? "Verifying Payment..." : "Opening Gateway..."}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <span className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5 font-medium">
                <Lock className="w-3 h-3 text-emerald-500" />
                Underwritten Milestone Escrow Protection • Secured by Razorpay
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
