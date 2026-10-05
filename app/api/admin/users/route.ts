import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { User } from "@/models/User";
import { PilotProfile } from "@/models/PilotProfile";
import { CompanyProfile } from "@/models/CompanyProfile";
import { Certification } from "@/models/Certification";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRole(["ADMIN"]);
    if (auth.errorResponse) return auth.errorResponse;

    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const query: any = {};
    if (role && role !== "ALL") query.role = role;
    if (status && status !== "ALL") query.status = status;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    const userIds = users.map((u) => u._id);

    const [pilotProfiles, companyProfiles, certifications] = await Promise.all([
      PilotProfile.find({ userId: { $in: userIds } }).lean(),
      CompanyProfile.find({ userId: { $in: userIds } }).lean(),
      Certification.find({ pilotId: { $in: userIds } }).lean(),
    ]);

    const pilotMap = new Map(pilotProfiles.map((p) => [p.userId.toString(), p]));
    const companyMap = new Map(companyProfiles.map((c) => [c.userId.toString(), c]));
    const certMap = new Map<string, any[]>();
    certifications.forEach((c) => {
      const pid = c.pilotId.toString();
      if (!certMap.has(pid)) certMap.set(pid, []);
      certMap.get(pid)!.push(c);
    });

    const enrichedUsers = users.map((u) => {
      const uid = u._id.toString();
      return {
        ...u,
        pilotProfile: pilotMap.get(uid) || null,
        companyProfile: companyMap.get(uid) || null,
        certifications: certMap.get(uid) || [],
      };
    });

    return NextResponse.json({ users: enrichedUsers, total: enrichedUsers.length });
  } catch (error: any) {
    console.error("Fetch admin users error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
