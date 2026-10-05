"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

export function StarRating({
  rating,
  totalReviews,
  editable = false,
  onChange,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const current = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!editable}
            onClick={() => editable && onChange && onChange(star)}
            onMouseEnter={() => editable && setHoverRating(star)}
            onMouseLeave={() => editable && setHoverRating(null)}
            className={`${editable ? "cursor-pointer p-0.5 hover:scale-110 transition" : "cursor-default"}`}
          >
            <Star
              className={`${starSizes[size]} ${
                star <= current
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-600 fill-transparent"
              }`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="text-xs font-bold text-slate-200">
          {rating.toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className="text-xs text-slate-400">
          ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
}

export default StarRating;
