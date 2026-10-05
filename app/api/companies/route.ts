import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { CompanyProfile } from "@/models/CompanyProfile";
import { Job } from "@/models/Job";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const industry = searchParams.get("industry") || "";

    const userQuery: any = { role: "COMPANY", status: "ACTIVE" };
    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
      ];
    }

    const companyUsers = await User.find(userQuery).select("-passwordHash").lean();
    const companyUserIds = companyUsers.map((u) => u._id);

    const profileQuery: any = { userId: { $in: companyUserIds } };
    if (industry) {
      profileQuery.industry = { $regex: industry, $options: "i" };
    }

    const profiles = await CompanyProfile.find(profileQuery).lean();
    const profileMap = new Map(profiles.map((pr) => [pr.userId.toString(), pr]));

    const jobsCount = await Job.aggregate([
      { $match: { companyId: { $in: companyUserIds } } },
      { $group: { _id: "$companyId", count: { $sum: 1 } } },
    ]);
    const jobCountMap = new Map(jobsCount.map((j) => [j._id.toString(), j.count]));

    const results = companyUsers
      .filter((u) => profileMap.has(u._id.toString()))
      .map((u) => ({
        ...u,
        profile: profileMap.get(u._id.toString()),
        totalJobsPosted: jobCountMap.get(u._id.toString()) || 0,
      }));

    return NextResponse.json({ companies: results });
  } catch (error: any) {
    console.error("Fetch companies error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
