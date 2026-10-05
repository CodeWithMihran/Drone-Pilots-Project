import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import "@/models/User";
import "@/models/Job";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    await connectToDatabase();

    const reviews = await Review.find({ revieweeId: userId })
      .populate("reviewerId", "name role profileImage location")
      .populate("jobId", "title serviceType location date")
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 5.0;

    return NextResponse.json({
      reviews,
      totalReviews,
      averageRating: Math.round(avgRating * 10) / 10,
    });
  } catch (error: any) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
