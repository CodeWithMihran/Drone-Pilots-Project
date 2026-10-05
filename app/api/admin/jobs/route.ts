import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";
import "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRole(["ADMIN"]);
    if (auth.errorResponse) return auth.errorResponse;

    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const serviceType = searchParams.get("service") || "";

    const query: any = {};
    if (status && status !== "ALL") query.status = status;
    if (serviceType && serviceType !== "ALL") query.serviceType = serviceType;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .populate("companyId", "name email phone profileImage location")
      .populate("assignedPilotId", "name email phone profileImage location")
      .sort({ createdAt: -1 })
      .lean();

    const jobIds = jobs.map((j) => j._id);
    const appCounts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);
    const appCountMap = new Map(appCounts.map((a) => [a._id.toString(), a.count]));

    const enrichedJobs = jobs.map((j) => ({
      ...j,
      applicationsCount: appCountMap.get(j._id.toString()) || 0,
    }));

    return NextResponse.json({ jobs: enrichedJobs, total: enrichedJobs.length });
  } catch (error: any) {
    console.error("Admin fetch jobs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
