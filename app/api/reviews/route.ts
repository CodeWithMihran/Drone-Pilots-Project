import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuthUser } from "@/lib/permissions";
import { Review } from "@/models/Review";
import { Job } from "@/models/Job";
import { PilotProfile } from "@/models/PilotProfile";
import { CompanyProfile } from "@/models/CompanyProfile";
import { Notification } from "@/models/Notification";
import { ReviewSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const validation = ReviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { jobId, revieweeId, rating, comment } = validation.data;

    // Self review prevention
    if (auth.user.id === revieweeId) {
      return NextResponse.json(
        { error: "You cannot write a review for yourself." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Only allow reviews on COMPLETED jobs
    if (job.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Reviews can only be submitted after the project has been completed." },
        { status: 400 }
      );
    }

    // Check that reviewer was either the company or the assigned pilot
    const isCompany = job.companyId.toString() === auth.user.id;
    const isPilot = job.assignedPilotId?.toString() === auth.user.id;

    if (!isCompany && !isPilot && auth.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only the hiring company or assigned pilot of this job can submit a review." },
        { status: 403 }
      );
    }

    // Prevent duplicate review
    const existing = await Review.findOne({
      jobId: job._id,
      reviewerId: auth.user.id,
      revieweeId,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted a review for this project." },
        { status: 409 }
      );
    }

    const review = await Review.create({
      jobId: job._id,
      reviewerId: auth.user.id,
      revieweeId,
      rating,
      comment,
    });

    // Recalculate average rating for reviewee
    const allReviews = await Review.find({ revieweeId }).lean();
    const totalReviews = allReviews.length;
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    // Update PilotProfile or CompanyProfile
    await PilotProfile.findOneAndUpdate(
      { userId: revieweeId },
      { rating: Math.round(avgRating * 10) / 10, totalReviews }
    );
    await CompanyProfile.findOneAndUpdate(
      { userId: revieweeId },
      { rating: Math.round(avgRating * 10) / 10, totalReviews }
    );

    // Notify reviewee
    await Notification.create({
      userId: revieweeId as any,
      title: "New Review Received ⭐",
      message: `${auth.user.name} left you a ${rating}-star review for "${job.title}".`,
      type: "REVIEW",
      link: isCompany ? "/pilot/reviews" : "/company/reviews",
    });

    return NextResponse.json(
      {
        message: "Review submitted successfully!",
        review,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
