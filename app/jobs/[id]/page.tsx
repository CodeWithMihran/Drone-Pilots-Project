"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Star,
  Send,
  ArrowLeft,
  Lock,
  Layers,
  Sparkles,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { formatCurrency, formatDate, formatServiceType } from "@/lib/utils";
import { MatchScoreBadge } from "@/components/shared/MatchScoreBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LocationMapFallback } from "@/components/shared/LocationMapFallback";
import { StarRating } from "@/components/shared/StarRating";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [availability, setAvailability] = useState("Available for flight on scheduled date");
  const [submittingApply, setSubmittingApply] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Status update states
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Simulated payment modal state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) {
        throw new Error("Job not found or unavailable.");
      }
      const data = await res.json();
      setJob(data.job);
      if (data.job?.budget && !bidAmount) {
        setBidAmount(data.job.budget.toString());
      }
    } catch (err: any) {
      setError(err.message || "Failed to load job details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchJobDetails();
  }, [id]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingApply(true);
    setError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: id,
          proposal,
          bidAmount: Number(bidAmount),
          availability,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit proposal");

      setApplySuccess(true);
      setApplyModalOpen(false);
      fetchJobDetails();
    } catch (err: any) {
      setError(err.message || "Failed to apply");
    } finally {
      setSubmittingApply(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchJobDetails();
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSimulatedPayment = async () => {
    setPaying(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: id,
          amount: job.budget,
          notes: "Approved flight mission milestone release.",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");

      setPaymentSuccess(true);
      setPayModalOpen(false);
      fetchJobDetails();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPaying(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const targetUserId =
        isCompanyOwner && job.assignedPilotId
          ? job.assignedPilotId._id || job.assignedPilotId
          : job.companyId._id || job.companyId;

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: id,
          revieweeId: targetUserId,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review submission failed");

      setReviewSuccess(true);
      setReviewModalOpen(false);
      fetchJobDetails();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading project flight specifications...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Project Not Available</h2>
        <p className="text-xs text-slate-400">{error || "This job listing could not be found."}</p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const role = (session?.user as any)?.role;
  const currentUserId = (session?.user as any)?.id;
  const isCompanyOwner = job.companyId?._id?.toString() === currentUserId || job.companyId?.toString() === currentUserId;
  const isAssignedPilot = job.assignedPilotId?._id?.toString() === currentUserId || job.assignedPilotId?.toString() === currentUserId;
  const isJobOpen = job.status === "OPEN" || job.status === "APPLICATIONS_RECEIVED";

  return (
    <div className="flex-1 bg-[#060b18] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">
          <Link href="/jobs" className="hover:text-cyan-400 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-slate-200 truncate max-w-md">{job.title}</span>
        </div>

        {applySuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Your proposal was submitted successfully! The company has been notified.</span>
          </div>
        )}

        {paymentSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Simulated Escrow Payment has been released directly to the pilot!</span>
          </div>
        )}

        {reviewSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Thank you! Your verified rating and review have been recorded.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/90 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                  {formatServiceType(job.serviceType)}
                </span>
                <StatusBadge status={job.status} type="job" />
                {job.matchResult && (
                  <MatchScoreBadge score={job.matchResult.score} size="md" />
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Building className="w-4 h-4 text-slate-500" />
                  {job.companyId?.name || "Verified Organization"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {job.location?.city}, {job.location?.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  Mission Date: {formatDate(job.date)}
                </span>
              </div>
            </div>

            {/* Mission Description */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/90 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Mission Scope & Objectives
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Flight Requirements & Hardware Specs */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c142b] border border-slate-800/90 shadow-xl space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Regulatory & Equipment Requirements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Required Certification</p>
                  <p className="text-xs font-bold text-emerald-300 mt-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {job.requiredCertification || "FAA Part 107 Commercial Remote Pilot"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Pilot Experience</p>
                  <p className="text-xs font-bold text-white mt-1">
                    {job.requiredExperience}+ Year(s) Commercial Experience
                  </p>
                </div>
              </div>

              {job.requiredEquipment && job.requiredEquipment.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 mb-2">
                    Required Aircraft & Payloads
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredEquipment.map((eq: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-cyan-300"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-300 mb-2">
                    Additional Flight Protocols
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {job.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Location & Map Section */}
            <LocationMapFallback
              location={job.location}
              title={`Flight Area: ${job.location?.city || "Site"}`}
            />
          </div>

          {/* Action / Sidebar Column */}
          <div className="space-y-6">
            {/* Compensation & Apply Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0e1836] to-[#0a1126] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Total Compensation
                </span>
                <div className="text-3xl font-extrabold text-white mt-1">
                  {formatCurrency(job.budget)}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Fixed project fee (simulated escrow protected)
                </p>
              </div>

              <div className="space-y-2.5 py-4 border-y border-slate-700/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Estimated Duration</span>
                  <span className="text-white font-medium">{job.duration || "1 Day"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Start Time</span>
                  <span className="text-white font-medium">{job.startTime || "09:00 AM"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Application Deadline</span>
                  <span className="text-white font-medium">{formatDate(job.applicationDeadline)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Applications Received</span>
                  <span className="text-cyan-300 font-bold">{job.applicationsCount || 0} Pilot Proposals</span>
                </div>
              </div>

              {/* Action Buttons based on User Role & Status */}
              <div className="space-y-3">
                {/* 1. If Pilot is viewing */}
                {role === "PILOT" && (
                  <>
                    {job.existingApplication ? (
                      <div className="p-4 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-center space-y-2">
                        <CheckCircle2 className="w-6 h-6 text-cyan-400 mx-auto" />
                        <p className="text-xs font-bold text-white">Application Submitted</p>
                        <p className="text-[11px] text-slate-400">
                          Your bid: <strong>{formatCurrency(job.existingApplication.bidAmount)}</strong>
                        </p>
                        <StatusBadge status={job.existingApplication.status} type="application" />
                      </div>
                    ) : isJobOpen ? (
                      job.isPilotVerified ? (
                        <button
                          id="apply-job-btn"
                          onClick={() => setApplyModalOpen(true)}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:opacity-95 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/25 transition flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit Flight Proposal</span>
                        </button>
                      ) : (
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2.5">
                          <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                          <p className="text-xs font-bold text-white">Certification Required</p>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            This commercial project requires a verified pilot credential.
                          </p>
                          <Link
                            href="/pilot/certification"
                            className="inline-block px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                          >
                            Upload Certificate Now
                          </Link>
                        </div>
                      )
                    ) : (
                      <div className="p-3.5 rounded-xl bg-slate-800 text-center text-xs font-semibold text-slate-400">
                        This job is currently {job.status.replace(/_/g, " ")}.
                      </div>
                    )}
                  </>
                )}

                {/* 2. If Assigned Pilot */}
                {isAssignedPilot && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                    <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      You are the Assigned Pilot for this project
                    </p>

                    {job.status === "PILOT_SELECTED" && (
                      <button
                        onClick={() => handleUpdateStatus("IN_PROGRESS")}
                        disabled={updatingStatus}
                        className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs transition"
                      >
                        Start Flight Mission (In Progress)
                      </button>
                    )}

                    {job.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleUpdateStatus("COMPLETED")}
                        disabled={updatingStatus}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs transition"
                      >
                        Mark Mission as Completed
                      </button>
                    )}

                    {job.status === "COMPLETED" && !job.hasReviewed && (
                      <button
                        onClick={() => setReviewModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Star className="w-4 h-4" />
                        <span>Leave Review for Client</span>
                      </button>
                    )}
                  </div>
                )}

                {/* 3. If Company Owner */}
                {isCompanyOwner && (
                  <div className="space-y-3 pt-2">
                    <Link
                      href={`/company/applications?jobId=${job._id}`}
                      className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                    >
                      <span>Review {job.applicationsCount || 0} Applications</span>
                    </Link>

                    {job.status === "PILOT_SELECTED" && (
                      <button
                        onClick={() => handleUpdateStatus("IN_PROGRESS")}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition"
                      >
                        Mark Mission In-Progress
                      </button>
                    )}

                    {job.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleUpdateStatus("COMPLETED")}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                      >
                        Mark Mission Completed
                      </button>
                    )}

                    {job.status === "COMPLETED" && (
                      <div className="space-y-2">
                        <button
                          id="pay-pilot-btn"
                          onClick={() => setPayModalOpen(true)}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Pilot ({formatCurrency(job.budget)})</span>
                        </button>

                        {!job.hasReviewed && (
                          <button
                            id="review-pilot-btn"
                            onClick={() => setReviewModalOpen(true)}
                            className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition flex items-center justify-center gap-1.5"
                          >
                            <Star className="w-4 h-4" />
                            <span>Review Pilot Performance</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Not logged in */}
                {!session && (
                  <Link
                    href={`/login?callbackUrl=/jobs/${job._id}`}
                    className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <span>Sign In to Apply</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Company Info Card */}
            <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/90 shadow-xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                About the Hiring Organization
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center font-bold text-cyan-400 text-sm">
                  {job.companyId?.name ? job.companyId.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{job.companyId?.name}</h4>
                  <p className="text-xs text-slate-400">{job.companyProfile?.industry || "Industrial Enterprise"}</p>
                </div>
              </div>

              {job.companyProfile && (
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-2">
                  <StarRating rating={job.companyProfile.rating || 5.0} totalReviews={job.companyProfile.totalReviews} size="sm" />
                  <p className="line-clamp-3 text-slate-300">{job.companyProfile.description || "Commercial drone operations client."}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Proposal Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#0c142b] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Submit Flight Proposal</h3>
                <p className="text-xs text-slate-400">Project: {job.title}</p>
              </div>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Proposed Bid Amount (USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    required
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="1200"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <span className="text-[10px] text-slate-500">Client's listed budget: {formatCurrency(job.budget)}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Flight Readiness & Availability
                </label>
                <input
                  type="text"
                  required
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="Available immediately for morning flights"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Proposal & Flight Plan
                </label>
                <textarea
                  required
                  rows={4}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Describe your flight approach, payload sensors to be used, and turnaround time for post-processing deliverable files..."
                  className="w-full p-3 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  id="confirm-submit-proposal-btn"
                  type="submit"
                  disabled={submittingApply}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                >
                  {submittingApply ? "Sending..." : "Submit Proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated Payment Confirmation Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0c142b] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Release Simulated Payment</h3>
            <p className="text-xs text-slate-400">
              You are authorizing direct payout to the assigned pilot for mission completion:
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Project:</span>
                <span className="text-white font-medium truncate max-w-[200px]">{job.title}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Assigned Pilot:</span>
                <span className="text-cyan-300 font-medium">{job.assignedPilotId?.name || "Pilot"}</span>
              </div>
              <div className="flex justify-between text-xs font-bold pt-2 border-t border-slate-800">
                <span className="text-white">Total Payout:</span>
                <span className="text-emerald-400 text-base">{formatCurrency(job.budget)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPayModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                id="confirm-pay-pilot-btn"
                type="button"
                onClick={handleSimulatedPayment}
                disabled={paying}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                {paying ? "Processing..." : "Authorize Payout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0c142b] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <Star className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-white">Rate Flight Performance</h3>
              <p className="text-xs text-slate-400">Your feedback helps verify excellence</p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="text-center py-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Star Rating
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={reviewRating}
                    editable={true}
                    onChange={(r) => setReviewRating(r)}
                    size="lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Feedback Comment
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about flight accuracy, communication, deliverables, and professionalism..."
                  className="w-full p-3 rounded-xl bg-[#070e22] border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  id="confirm-submit-review-btn"
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
