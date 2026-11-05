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
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Star,
  Send,
  ArrowLeft,
  Lock,
  Layers,
  CreditCard,
  ChevronRight,
  ExternalLink,
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
      <div className="max-w-5xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-[#fabf28] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs sm:text-sm text-muted-foreground font-mono">Loading mission specifications...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Mission Brief Not Available</h2>
        <p className="text-sm text-muted-foreground">{error || "This mission brief could not be found or has expired."}</p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Missions
        </Link>
      </div>
    );
  }

  const role = (session?.user as any)?.role;
  const currentUserId = (session?.user as any)?.id;
  const isCompanyOwner =
    job.companyId?._id?.toString() === currentUserId ||
    job.companyId?.toString() === currentUserId;
  const isAssignedPilot =
    job.assignedPilotId?._id?.toString() === currentUserId ||
    job.assignedPilotId?.toString() === currentUserId;
  const isJobOpen = job.status === "OPEN" || job.status === "APPLICATIONS_RECEIVED";

  return (
    <div className="flex-1 bg-background py-8 sm:py-12 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/jobs" className="hover:text-foreground transition-colors flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold truncate max-w-md">{job.title}</span>
        </div>

        {applySuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">Your proposal was submitted successfully! The company has been notified.</span>
          </div>
        )}

        {paymentSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">Escrow payment has been successfully released to the pilot.</span>
          </div>
        )}

        {reviewSuccess && (
          <div className="p-4 rounded-2xl bg-[#fabf28]/15 border border-[#fabf28]/40 text-zinc-900 dark:text-[#fabf28] text-xs flex items-center gap-2.5">
            <Star className="w-5 h-5 text-[#fabf28] shrink-0 fill-[#fabf28]" />
            <span className="font-semibold">Thank you! Your verified rating and review have been recorded.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Hero Card */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-[#fabf28]/15 text-zinc-900 dark:text-[#fabf28] text-xs font-bold">
                  {formatServiceType(job.serviceType)}
                </span>
                <StatusBadge status={job.status} type="job" />
                {job.matchResult && <MatchScoreBadge score={job.matchResult.score} size="md" />}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                <span className="flex items-center gap-1.5 text-foreground font-semibold">
                  <Building className="w-4 h-4 text-zinc-400" />
                  {job.companyId?.name || "Enterprise Client"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#fabf28]" />
                  {job.location?.city}, {job.location?.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-foreground">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  Mission Date: {formatDate(job.date)}
                </span>
              </div>
            </div>

            {/* Mission Description Card */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#fabf28]" />
                Mission Scope & Objectives
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Regulatory & Equipment Requirements Card */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-xs space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Regulatory & Airframe Requirements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Required Certification</p>
                  <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    {job.requiredCertification || "FAA Part 107 Commercial Remote Pilot"}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Pilot Experience</p>
                  <p className="text-xs sm:text-sm text-foreground mt-1.5 font-bold">
                    {job.requiredExperience}+ Year(s) Commercial Experience
                  </p>
                </div>
              </div>

              {job.requiredEquipment && job.requiredEquipment.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-foreground mb-2.5">
                    Required Aircraft & Payloads
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredEquipment.map((eq: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-foreground font-semibold shadow-2xs"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-foreground mb-2.5">
                    Flight Protocols & Deliverable Requirements
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                    {job.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Flight Zone Map */}
            <LocationMapFallback
              location={job.location}
              title={`Flight Area: ${job.location?.city || "Site"}`}
            />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Compensation & Actions Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                  PROJECT BUDGET
                </span>
                <div className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-1 font-mono">
                  {formatCurrency(job.budget)}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Underwritten Escrow Protected</span>
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-zinc-100 dark:border-zinc-800/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-foreground font-semibold">{job.duration || "1 Day"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Start Time</span>
                  <span className="text-foreground font-semibold">{job.startTime || "09:00 AM"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Application Deadline</span>
                  <span className="text-foreground font-semibold">{formatDate(job.applicationDeadline)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Proposals Received</span>
                  <span className="text-foreground font-bold">{job.applicationsCount || 0} Pilots</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {role === "PILOT" && (
                  <>
                    {job.existingApplication ? (
                      <div className="p-4 rounded-2xl bg-[#fabf28]/10 border border-[#fabf28]/30 text-center space-y-2">
                        <CheckCircle2 className="w-5 h-5 text-zinc-950 dark:text-[#fabf28] mx-auto" />
                        <p className="text-xs font-bold text-foreground">Proposal Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          Your bid: <strong>{formatCurrency(job.existingApplication.bidAmount)}</strong>
                        </p>
                        <StatusBadge status={job.existingApplication.status} type="application" />
                      </div>
                    ) : isJobOpen ? (
                      job.isPilotVerified ? (
                        <button
                          id="apply-job-btn"
                          onClick={() => setApplyModalOpen(true)}
                          className="w-full h-12 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs tracking-tight shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit Flight Proposal</span>
                        </button>
                      ) : (
                        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-center space-y-2.5">
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto" />
                          <p className="text-xs font-bold text-foreground">FAA Part 107 Required</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Upload your credentials to bid on commercial missions.
                          </p>
                          <Link
                            href="/pilot/certification"
                            className="inline-block px-4 py-2 rounded-full bg-[#fabf28] text-zinc-950 font-bold text-xs shadow-xs"
                          >
                            Verify Credential Now
                          </Link>
                        </div>
                      )
                    ) : (
                      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-center text-xs font-semibold text-muted-foreground">
                        This mission brief is currently {job.status.replace(/_/g, " ")}.
                      </div>
                    )}
                  </>
                )}

                {isAssignedPilot && (
                  <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Assigned Pilot for this Project
                    </p>

                    {job.status === "PILOT_SELECTED" && (
                      <button
                        onClick={() => handleUpdateStatus("IN_PROGRESS")}
                        disabled={updatingStatus}
                        className="w-full h-11 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs transition-all shadow-xs"
                      >
                        Start Flight Mission
                      </button>
                    )}

                    {job.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleUpdateStatus("COMPLETED")}
                        disabled={updatingStatus}
                        className="w-full h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs"
                      >
                        Mark Mission as Completed
                      </button>
                    )}

                    {job.status === "COMPLETED" && !job.hasReviewed && (
                      <button
                        onClick={() => setReviewModalOpen(true)}
                        className="w-full h-11 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Star className="w-4 h-4 fill-zinc-950" />
                        <span>Leave Review for Client</span>
                      </button>
                    )}
                  </div>
                )}

                {isCompanyOwner && (
                  <div className="space-y-3 pt-1">
                    <Link
                      href={`/company/applications?jobId=${job._id}`}
                      className="w-full h-12 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs tracking-tight shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <span>Review {job.applicationsCount || 0} Proposals</span>
                    </Link>

                    {job.status === "PILOT_SELECTED" && (
                      <button
                        onClick={() => handleUpdateStatus("IN_PROGRESS")}
                        className="w-full h-11 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs transition-all shadow-xs"
                      >
                        Mark Mission In-Progress
                      </button>
                    )}

                    {job.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleUpdateStatus("COMPLETED")}
                        className="w-full h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs"
                      >
                        Mark Mission Completed
                      </button>
                    )}

                    {job.status === "COMPLETED" && (
                      <div className="space-y-2">
                        <button
                          id="pay-pilot-btn"
                          onClick={() => setPayModalOpen(true)}
                          className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-tight shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Release Escrow ({formatCurrency(job.budget)})</span>
                        </button>

                        {!job.hasReviewed && (
                          <button
                            id="review-pilot-btn"
                            onClick={() => setReviewModalOpen(true)}
                            className="w-full h-11 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Star className="w-4 h-4 fill-zinc-950" />
                            <span>Rate Pilot Performance</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!session && (
                  <Link
                    href={`/login?callbackUrl=/jobs/${job._id}`}
                    className="w-full h-12 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs tracking-tight shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>Sign In to Apply</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Hiring Organization Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Hiring Organization
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#fabf28]/15 text-zinc-950 dark:text-[#fabf28] flex items-center justify-center font-bold text-sm">
                  {job.companyId?.name ? job.companyId.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{job.companyId?.name || "Enterprise Client"}</h4>
                  <p className="text-xs text-muted-foreground">{job.companyProfile?.industry || "Industrial Infrastructure"}</p>
                </div>
              </div>

              {job.companyProfile && (
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-muted-foreground space-y-2">
                  <StarRating rating={job.companyProfile.rating || 5.0} totalReviews={job.companyProfile.totalReviews} size="sm" />
                  <p className="line-clamp-3 text-xs leading-relaxed">{job.companyProfile.description || "Commercial drone operations client."}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Proposal Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <div>
                <h3 className="text-lg font-bold text-foreground">Submit Flight Proposal</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Project: {job.title}</p>
              </div>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-muted-foreground hover:text-foreground flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Proposed Bid Amount (USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
                  <input
                    type="number"
                    required
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="1200"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-foreground text-xs focus:outline-none focus:border-[#fabf28]"
                  />
                </div>
                <span className="text-[11px] text-muted-foreground mt-1 block">Listed budget: {formatCurrency(job.budget)}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Flight Readiness & Availability
                </label>
                <input
                  type="text"
                  required
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="Available immediately for scheduled flight date"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-foreground text-xs focus:outline-none focus:border-[#fabf28]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Proposal & Flight Approach
                </label>
                <textarea
                  required
                  rows={4}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Describe your flight approach, payload sensors to be used, and deliverable timeline..."
                  className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-foreground text-xs focus:outline-none focus:border-[#fabf28]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="flex-1 h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-foreground font-bold text-xs hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="confirm-submit-proposal-btn"
                  type="submit"
                  disabled={submittingApply}
                  className="flex-1 h-11 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs transition-colors shadow-sm"
                >
                  {submittingApply ? "Sending..." : "Submit Proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Release Escrow Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-foreground">Release Escrow Payment</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Authorize direct payout to the assigned pilot for completed mission deliverables:
            </p>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project:</span>
                <span className="text-foreground font-semibold truncate max-w-[200px]">{job.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Pilot:</span>
                <span className="text-foreground font-semibold">{job.assignedPilotId?.name || "Pilot"}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-zinc-100 dark:border-zinc-800 text-sm">
                <span className="text-foreground">Total Payout:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{formatCurrency(job.budget)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPayModalOpen(false)}
                className="flex-1 h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-foreground font-bold text-xs hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-pay-pilot-btn"
                type="button"
                onClick={handleSimulatedPayment}
                disabled={paying}
                className="flex-1 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                {paying ? "Processing..." : "Authorize Payout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#fabf28]/20 text-[#fabf28] mx-auto flex items-center justify-center mb-2">
                <Star className="w-6 h-6 fill-[#fabf28]" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Rate Mission Performance</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Your verified feedback helps maintain quality</p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="text-center py-2">
                <label className="block text-xs font-bold text-foreground mb-2">
                  Select Rating
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
                <label className="block text-xs font-bold text-foreground mb-1.5">
                  Feedback Review
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about flight precision, safety adherence, communication, and deliverables..."
                  className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-foreground text-xs focus:outline-none focus:border-[#fabf28]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-foreground font-bold text-xs hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="confirm-submit-review-btn"
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 h-11 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs transition-colors shadow-sm"
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
