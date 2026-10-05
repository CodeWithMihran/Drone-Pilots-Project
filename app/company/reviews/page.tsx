"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MessageSquare, Briefcase, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import { EmptyState } from "@/components/shared/EmptyState";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pilot Reviews & Organization Ratings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Feedback left by commercial pilots after completing flight contracts for your organization.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black text-amber-400">
            {averageRating.toFixed(1)}
          </div>
          <div>
            <StarRating rating={averageRating} size="lg" />
            <p className="text-xs text-slate-400 mt-1">
              Based on {totalReviews} completed project {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        <Link
          href="/company/jobs"
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs transition"
        >
          Review Completed Flights
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-slate-800/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No Pilot Reviews Yet"
            description="Pilots will leave feedback for your organization upon completing mission milestones."
          />
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-6 rounded-3xl bg-[#0c142b] border border-slate-800/80 shadow-lg space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-cyan-400 font-bold text-xs flex items-center justify-center">
                    {rev.reviewerId?.name ? rev.reviewerId.name.charAt(0) : "P"}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {rev.reviewerId?.name || "Verified Pilot"}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Project: <strong className="text-cyan-300">{rev.jobId?.title || "Flight Mission"}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StarRating rating={rev.rating} size="sm" />
                  <span className="text-xs text-slate-500">{formatDate(rev.createdAt)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800/60">
                "{rev.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
