"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-6 max-w-5xl">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Client Reviews & Reputation
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Performance metrics and client ratings tied directly to completed, verified contract transactions.
        </p>
      </div>

      {/* Overview Card */}
      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="text-4xl font-bold text-foreground font-mono">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <StarRating rating={averageRating} size="lg" />
              <p className="text-xs text-muted-foreground mt-1">
                Based on {totalReviews} completed mission {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground sm:text-right">
            <span className="text-success font-semibold block">100% Verified Reviews</span>
            <span>Only hiring enterprises can submit feedback upon milestone release.</span>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-surface rounded-panel border border-border animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No client reviews recorded yet"
            description="Reviews and ratings will appear here as enterprise clients approve deliverables."
          />
        ) : (
          reviews.map((rev) => (
            <Card key={rev._id}>
              <CardContent className="p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-control bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {rev.reviewerId?.name ? rev.reviewerId.name.charAt(0) : "C"}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {rev.reviewerId?.name || "Client Organization"}
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

                <p className="text-xs text-foreground leading-relaxed italic bg-surface-2 p-3.5 rounded-control border border-border">
                  "{rev.comment}"
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
