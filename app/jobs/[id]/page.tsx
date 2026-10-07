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
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-body text-muted-foreground">Loading flight specifications...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
        <h2 className="text-heading-2 font-semibold text-foreground">Project Not Available</h2>
        <p className="text-body text-muted-foreground">{error || "This job listing could not be found."}</p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control bg-surface-2 text-primary text-label font-medium hover:bg-border/20 transition-colors"
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
    <div className="flex-1 bg-background py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-caption text-subtle">
          <Link href="/jobs" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-md">{job.title}</span>
        </div>

        {applySuccess && (
          <div className="mb-6 p-4 rounded-panel bg-success/10 border border-success/30 text-success text-body flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Your proposal was submitted successfully! The company has been notified.</span>
          </div>
        )}

        {paymentSuccess && (
          <div className="mb-6 p-4 rounded-panel bg-success/10 border border-success/30 text-success text-body flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Escrow payment has been successfully released to the pilot.</span>
          </div>
        )}

        {reviewSuccess && (
          <div className="mb-6 p-4 rounded-panel bg-warning/10 border border-warning/30 text-warning text-body flex items-center gap-3">
            <Star className="w-5 h-5 shrink-0" />
            <span>Thank you! Your verified rating and review have been recorded.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="p-6 sm:p-8 rounded-panel bg-card border border-border shadow-md space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-caption font-medium">
                  {formatServiceType(job.serviceType)}
                </span>
                <StatusBadge status={job.status} type="job" />
                {job.matchResult && <MatchScoreBadge score={job.matchResult.score} size="md" />}
              </div>

              <h1 className="text-display text-foreground tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-caption text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <Building className="w-4 h-4 text-subtle" />
                  {job.companyId?.name || "Verified Organization"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {job.location?.city}, {job.location?.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-foreground">
                  <Calendar className="w-4 h-4 text-info" />
                  Mission Date: {formatDate(job.date)}
                </span>
              </div>
            </div>

            {/* Mission Description */}
            <div className="p-6 sm:p-8 rounded-panel bg-card border border-border shadow-md space-y-4">
              <h3 className="text-label text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Mission Scope & Objectives
              </h3>
              <p className="text-body text-muted-foreground leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Regulatory & Equipment Requirements */}
            <div className="p-6 sm:p-8 rounded-panel bg-card border border-border shadow-md space-y-6">
              <h3 className="text-label text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                Regulatory & Equipment Requirements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-control bg-surface-2 border border-border">
                  <p className="text-caption font-medium text-subtle uppercase">Required Certification</p>
                  <p className="text-label text-success mt-1 flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    {job.requiredCertification || "FAA Part 107 Commercial Remote Pilot"}
                  </p>
                </div>

                <div className="p-4 rounded-control bg-surface-2 border border-border">
                  <p className="text-caption font-medium text-subtle uppercase">Pilot Experience</p>
                  <p className="text-label text-foreground mt-1 font-medium">
                    {job.requiredExperience}+ Year(s) Commercial Experience
                  </p>
                </div>
              </div>

              {job.requiredEquipment && job.requiredEquipment.length > 0 && (
                <div>
                  <h4 className="text-label font-medium text-foreground mb-2">
                    Required Aircraft & Payloads
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredEquipment.map((eq: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-control bg-surface-2 border border-border text-caption text-primary font-medium"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h4 className="text-label font-medium text-foreground mb-2">
                    Additional Flight Protocols
                  </h4>
                  <ul className="space-y-2 text-body text-muted-foreground">
                    {job.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-info shrink-0 mt-1" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Location Map */}
            <LocationMapFallback
              location={job.location}
              title={`Flight Area: ${job.location?.city || "Site"}`}
            />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Compensation & Actions */}
            <div className="p-6 rounded-panel bg-card border border-border shadow-md space-y-6">
              <div>
                <span className="text-caption font-medium uppercase tracking-wider text-primary">
                  Total Compensation
                </span>
                <div className="text-heading-1 text-foreground font-semibold mt-1">
                  {formatCurrency(job.budget)}
                </div>
                <p className="text-caption text-subtle mt-0.5">
                  Fixed project fee (escrow protected)
                </p>
              </div>

              <div className="space-y-2.5 py-4 border-y border-border text-caption">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Duration</span>
                  <span className="text-foreground font-medium">{job.duration || "1 Day"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Start Time</span>
                  <span className="text-foreground font-medium">{job.startTime || "09:00 AM"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Application Deadline</span>
                  <span className="text-foreground font-medium">{formatDate(job.applicationDeadline)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Applications Received</span>
                  <span className="text-primary font-medium">{job.applicationsCount || 0} Proposals</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {role === "PILOT" && (
                  <>
                    {job.existingApplication ? (
                      <div className="p-4 rounded-control bg-primary/10 border border-primary/30 text-center space-y-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto" />
                        <p className="text-label font-medium text-foreground">Application Submitted</p>
                        <p className="text-caption text-muted-foreground">
                          Your bid: <strong>{formatCurrency(job.existingApplication.bidAmount)}</strong>
                        </p>
                        <StatusBadge status={job.existingApplication.status} type="application" />
                      </div>
                    ) : isJobOpen ? (
                      job.isPilotVerified ? (
                        <button
                          id="apply-job-btn"
                          onClick={() => setApplyModalOpen(true)}
                          className="w-full h-11 rounded-control bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-body transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit Flight Proposal</span>
                        </button>
                      ) : (
                        <div className="p-4 rounded-control bg-warning/10 border border-warning/30 text-center space-y-2.5">
                          <AlertCircle className="w-5 h-5 text-warning mx-auto" />
                          <p className="text-label font-medium text-foreground">Certification Required</p>
                          <p className="text-caption text-muted-foreground leading-relaxed">
                            This commercial project requires a verified pilot credential.
                          </p>
                          <Link
                            href="/pilot/certification"
                            className="inline-block px-3.5 py-2 rounded-control bg-warning text-foreground font-medium text-caption"
                          >
                            Upload Certificate Now
                          </Link>
                        </div>
                      )
                    ) : (
                      <div className="p-3.5 rounded-control bg-surface-2 text-center text-caption font-medium text-muted-foreground">
                        This job is currently {job.status.replace(/_/g, " ")}.
                      </div>
                    )}
                  </>
                )}

                {isAssignedPilot && (
                  <div className="p-4 rounded-control bg-success/10 border border-success/30 space-y-3">
                    <p className="text-label font-medium text-success flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Assigned Pilot for this project
                    </p>

                    {job.status === "PILOT_SELECTED" && (
                      <button
                        onClick={() => handleUpdateStatus("IN_PROGRESS")}
                        disabled={updatingStatus}
                        className="w-full h-10 rounded-control bg-primary text-primary-foreground font-medium text-caption transition-colors"
                      >
                        Start Flight Mission
                      </button>
                    )}

                    {job.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleUpdateStatus("COMPLETED")}
                        disabled={updatingStatus}
                        className="w-full h-10 rounded-control bg-success text-foreground font-medium text-caption transition-colors"
                      >
                        Mark Mission as Completed
                      </button>
                    )}

                    {job.status === "COMPLETED" && !job.hasReviewed && (
                      <button
                        onClick={() => setReviewModalOpen(true)}
                        className="w-full h-10 rounded-control bg-warning text-foreground font-medium text-caption transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Star className="w-4 h-4" />
                        <span>Leave Review for Client</span>
                      </button>
                    )}
                  </div>
                )}

                {isCompanyOwner && (
                  <div className="space-y-3 pt-1">
                    <Link
                      href={`/company/applications?jobId=${job._id}`}
                      className="w-full h-11 rounded-control bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-body transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Review {job.applicationsCount || 0} Applications</span>
                    </Link>

                    {job.status === "PILOT_SELECTED" && (
                      <button
                        onClick={() => handleUpdateStatus("IN_PROGRESS")}
                        className="w-full h-10 rounded-control bg-info hover:bg-info/90 text-foreground font-medium text-caption transition-colors"
                      >
                        Mark Mission In-Progress
                      </button>
                    )}

                    {job.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleUpdateStatus("COMPLETED")}
                        className="w-full h-10 rounded-control bg-success hover:bg-success/90 text-foreground font-medium text-caption transition-colors"
                      >
                        Mark Mission Completed
                      </button>
                    )}

                    {job.status === "COMPLETED" && (
                      <div className="space-y-2">
                        <button
                          id="pay-pilot-btn"
                          onClick={() => setPayModalOpen(true)}
                          className="w-full h-11 rounded-control bg-success hover:bg-success/90 text-foreground font-medium text-body transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pay Pilot ({formatCurrency(job.budget)})</span>
                        </button>

                        {!job.hasReviewed && (
                          <button
                            id="review-pilot-btn"
                            onClick={() => setReviewModalOpen(true)}
                            className="w-full h-10 rounded-control bg-warning/20 border border-warning/40 text-warning font-medium text-caption hover:bg-warning/30 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Star className="w-4 h-4" />
                            <span>Review Pilot Performance</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!session && (
                  <Link
                    href={`/login?callbackUrl=/jobs/${job._id}`}
                    className="w-full h-11 rounded-control bg-primary text-primary-foreground font-medium text-body transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Sign In to Apply</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Company Info Card */}
            <div className="p-6 rounded-panel bg-card border border-border shadow-md space-y-4">
              <h3 className="text-caption font-medium uppercase tracking-wider text-muted-foreground">
                About the Hiring Organization
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-control bg-surface-2 flex items-center justify-center font-semibold text-primary text-label">
                  {job.companyId?.name ? job.companyId.name.charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h4 className="text-label font-medium text-foreground">{job.companyId?.name}</h4>
                  <p className="text-caption text-muted-foreground">{job.companyProfile?.industry || "Industrial Enterprise"}</p>
                </div>
              </div>

              {job.companyProfile && (
                <div className="pt-3 border-t border-border text-caption text-muted-foreground space-y-2">
                  <StarRating rating={job.companyProfile.rating || 5.0} totalReviews={job.companyProfile.totalReviews} size="sm" />
                  <p className="line-clamp-3 text-body">{job.companyProfile.description || "Commercial drone operations client."}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Proposal Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-panel bg-card border border-border shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-heading-3 text-foreground font-semibold">Submit Flight Proposal</h3>
                <p className="text-caption text-muted-foreground">Project: {job.title}</p>
              </div>
              <button
                onClick={() => setApplyModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block text-label font-medium text-foreground mb-1.5">
                  Proposed Bid Amount (USD)
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-subtle absolute left-3.5 top-3.5" />
                  <input
                    type="number"
                    required
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="1200"
                    className="w-full pl-10 pr-4 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body focus:outline-none focus:border-primary"
                  />
                </div>
                <span className="text-caption text-muted-foreground mt-1 block">Client's listed budget: {formatCurrency(job.budget)}</span>
              </div>

              <div>
                <label className="block text-label font-medium text-foreground mb-1.5">
                  Flight Readiness & Availability
                </label>
                <input
                  type="text"
                  required
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="Available immediately for morning flights"
                  className="w-full px-3.5 py-2.5 rounded-control bg-surface-2 border border-border text-foreground text-body focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-label font-medium text-foreground mb-1.5">
                  Proposal & Flight Plan
                </label>
                <textarea
                  required
                  rows={4}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Describe your flight approach, payload sensors to be used, and turnaround time..."
                  className="w-full p-3 rounded-control bg-surface-2 border border-border text-foreground text-body focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="flex-1 h-11 rounded-control bg-surface-2 text-foreground font-medium text-body hover:bg-border/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="confirm-submit-proposal-btn"
                  type="submit"
                  disabled={submittingApply}
                  className="flex-1 h-11 rounded-control bg-primary text-primary-foreground font-medium text-body hover:bg-primary/90 transition-colors"
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
          <div className="w-full max-w-md rounded-panel bg-card border border-border shadow-2xl p-6 sm:p-8 space-y-5 text-center">
            <div className="w-12 h-12 rounded-control bg-success/20 text-success mx-auto flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>

            <h3 className="text-heading-3 text-foreground font-semibold">Release Escrow Payment</h3>
            <p className="text-body text-muted-foreground">
              Authorize direct payout to the assigned pilot for mission completion:
            </p>

            <div className="p-4 rounded-control bg-surface-2 border border-border text-left space-y-2">
              <div className="flex justify-between text-caption">
                <span className="text-muted-foreground">Project:</span>
                <span className="text-foreground font-medium truncate max-w-[200px]">{job.title}</span>
              </div>
              <div className="flex justify-between text-caption">
                <span className="text-muted-foreground">Assigned Pilot:</span>
                <span className="text-primary font-medium">{job.assignedPilotId?.name || "Pilot"}</span>
              </div>
              <div className="flex justify-between text-label font-semibold pt-2 border-t border-border">
                <span className="text-foreground">Total Payout:</span>
                <span className="text-success text-body">{formatCurrency(job.budget)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPayModalOpen(false)}
                className="flex-1 h-11 rounded-control bg-surface-2 text-foreground font-medium text-body hover:bg-border/20 transition-colors"
              >
                Cancel
              </button>
              <button
                id="confirm-pay-pilot-btn"
                type="button"
                onClick={handleSimulatedPayment}
                disabled={paying}
                className="flex-1 h-11 rounded-control bg-success text-foreground font-medium text-body hover:bg-success/90 transition-colors"
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
          <div className="w-full max-w-md rounded-panel bg-card border border-border shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="text-center">
              <Star className="w-8 h-8 text-warning mx-auto mb-2" />
              <h3 className="text-heading-3 text-foreground font-semibold">Rate Flight Performance</h3>
              <p className="text-caption text-muted-foreground">Your feedback helps verify excellence</p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="text-center py-2">
                <label className="block text-label font-medium text-foreground mb-2">
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
                <label className="block text-label font-medium text-foreground mb-1.5">
                  Feedback Comment
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about flight accuracy, communication, and deliverables..."
                  className="w-full p-3 rounded-control bg-surface-2 border border-border text-foreground text-body focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="flex-1 h-11 rounded-control bg-surface-2 text-foreground font-medium text-body hover:bg-border/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="confirm-submit-review-btn"
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 h-11 rounded-control bg-warning text-foreground font-medium text-body hover:bg-warning/90 transition-colors"
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