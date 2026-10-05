import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { Application } from "@/models/Application";
import "@/models/Job";
import "@/models/User";

export async function GET() {
  try {
    const auth = await requireRole(["PILOT"]);
    if (auth.errorResponse) return auth.errorResponse;

    await connectToDatabase();

    const applications = await Application.find({ pilotId: auth.user.id })
      .populate({
        path: "jobId",
        select: "title serviceType location budget date status startTime duration requirements",
        populate: {
          path: "companyId",
          select: "name email phone profileImage location",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ applications });
  } catch (error: any) {
    console.error("Fetch my applications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
