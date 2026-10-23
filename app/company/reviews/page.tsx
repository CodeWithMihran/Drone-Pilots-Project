"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MessageSquare, Briefcase, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CompanyReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(5.0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const userId = sessionData?.user?._id;

        if (userId) {
          const res = await fetch(`/api/reviews/${userId}`);
          if (res.ok) {
            const data = await res.json();
            setReviews(data.reviews || []);
            setAverageRating(data.averageRating || 5.0);
            setTotalReviews(data.totalReviews || 0);
          }
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-border-strong dark:hover:border-zinc-700 transition-all duration-300">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-warning"></span>
            </span>
            <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              Enterprise Reputation & Pilot Trust
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.025em] text-foreground">
            Pilot Feedback & Commercial Standing
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Reviews submitted by commercial pilots following contract fulfillment, escrow release, and mission deliverable approvals.
          </p>
        </div>

        <Button asChild variant="secondary" size="sm" className="h-10 px-5 text-xs font-semibold shrink-0">
          <Link href="/company/jobs">Inspect Active Missions</Link>
        </Button>
      </div>

      {/* Overview Card */}
      <div className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="text-4xl sm:text-5xl font-bold text-foreground font-mono">
            {averageRating.toFixed(1)}
          </div>
          <div>
            <StarRating rating={averageRating} size="lg" />
            <p className="text-xs text-muted-foreground mt-1.5">
              Based on <strong className="text-foreground">{totalReviews}</strong> mission {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground sm:text-right space-y-1">
          <span className="text-success font-semibold flex items-center sm:justify-end gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            100% Escrow-Verified Feedback
          </span>
          <span className="block text-subtle text-[11px]">Pilots rate communication, site briefing clarity, and payment speed.</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-surface dark:bg-zinc-950/90 rounded-panel border border-border dark:border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No pilot reviews recorded yet"
            description="Pilots will provide feedback on communication, site readiness, and payment speed upon contract fulfillment."
          />
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="rounded-panel bg-surface dark:bg-zinc-950/90 border border-border dark:border-zinc-800/80 p-6 shadow-xs space-y-3.5 hover:border-border-strong dark:hover:border-zinc-700/80 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-control bg-primary/15 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {rev.reviewerId?.name ? rev.reviewerId.name.charAt(0) : "P"}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {rev.reviewerId?.name || "Verified Pilot"}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Mission: <strong className="text-foreground">{rev.jobId?.title || "Flight Operation"}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StarRating rating={rev.rating} size="sm" />
                  <span className="text-xs text-subtle">{formatDate(rev.createdAt)}</span>
                </div>
              </div>

              <p className="text-xs text-foreground leading-relaxed italic bg-surface-2 dark:bg-zinc-900 p-4 rounded-control border border-border dark:border-zinc-800">
                "{rev.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
