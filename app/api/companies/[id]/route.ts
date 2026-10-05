import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { CompanyProfile } from "@/models/CompanyProfile";
import { Job } from "@/models/Job";
import { Review } from "@/models/Review";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    const user = await User.findOne({ _id: id, role: "COMPANY" })
      .select("-passwordHash")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const profile = await CompanyProfile.findOne({ userId: user._id }).lean();
    const jobs = await Job.find({ companyId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    const reviews = await Review.find({ revieweeId: user._id })
      .populate("reviewerId", "name profileImage")
      .populate("jobId", "title serviceType")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      company: {
        ...user,
        profile,
        jobs,
        reviews,
      },
    });
  } catch (error: any) {
    console.error("Get company detail error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
