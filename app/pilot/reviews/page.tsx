"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";

export default function PilotReviewsPage() {
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
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-7 sm:p-9 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[#fabf28] font-bold text-sm leading-none">—</span>
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              CLIENT RATINGS
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            Client Reviews & Reputation
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Verified client feedback and ratings tied directly to completed, escrow-released flight missions.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-foreground px-4 py-2 rounded-full bg-surface-2 dark:bg-zinc-850 border border-border dark:border-zinc-800">
          <Star className="w-4 h-4 fill-[#fabf28] text-[#fabf28]" />
          <span>Average Rating: {averageRating.toFixed(1)} / 5.0</span>
        </div>
      </div>

      {/* Overview Card */}
      <div className="rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="text-4xl sm:text-5xl font-extrabold text-foreground font-sans">
            {averageRating.toFixed(1)}
          </div>
          <div>
            <StarRating rating={averageRating} size="lg" />
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Aggregated across <strong className="text-foreground">{totalReviews}</strong> verified shoot {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground sm:text-right space-y-1">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center sm:justify-end gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            100% Escrow-Verified Feedback
          </span>
          <span className="block text-muted-foreground text-[11px]">Only clients can review upon mission delivery acceptance.</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-white dark:bg-[#161b22] rounded-3xl border border-border/80 dark:border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description="Client evaluations and star ratings will populate here once you complete assigned operations."
          />
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-xs hover:shadow-md transition-all duration-200 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-950 dark:bg-zinc-850 text-[#fabf28] flex items-center justify-center font-bold text-sm">
                    {rev.reviewerId?.name ? rev.reviewerId.name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {rev.reviewerId?.name || "Client Organization"}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Mission: {rev.jobId?.title || "Commercial Flight"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StarRating rating={rev.rating} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(rev.createdAt)}
                  </span>
                </div>
              </div>

              {rev.comment && (
                <div className="p-4 rounded-2xl bg-[#faf8f5]/80 dark:bg-zinc-900/50 border border-border/80 dark:border-zinc-800 text-xs text-foreground italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
