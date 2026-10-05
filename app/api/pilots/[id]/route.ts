import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PilotProfile } from "@/models/PilotProfile";
import { Certification } from "@/models/Certification";
import { Review } from "@/models/Review";
import { Job } from "@/models/Job";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    const user = await User.findOne({ _id: id, role: "PILOT" })
      .select("-passwordHash")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "Pilot not found" }, { status: 404 });
    }

    const profile = await PilotProfile.findOne({ userId: user._id }).lean();
    const certifications = await Certification.find({ pilotId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const reviews = await Review.find({ revieweeId: user._id })
      .populate("reviewerId", "name profileImage")
      .populate("jobId", "title serviceType")
      .sort({ createdAt: -1 })
      .lean();

    const completedJobsCount = await Job.countDocuments({
      assignedPilotId: user._id,
      status: "COMPLETED",
    });

    const now = new Date();
    const isVerified = certifications.some(
      (c) => c.status === "VERIFIED" && new Date(c.expiryDate) > now
    );

    return NextResponse.json({
      pilot: {
        ...user,
        profile,
        certifications,
        reviews,
        completedJobsCount,
        isVerified,
      },
    });
  } catch (error: any) {
    console.error("Get pilot detail error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
