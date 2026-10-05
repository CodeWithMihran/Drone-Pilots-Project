import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PilotProfile } from "@/models/PilotProfile";
import { Certification } from "@/models/Certification";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const verifiedOnly = searchParams.get("verified") === "true";
    const serviceType = searchParams.get("service") || "";

    // Find all users with role PILOT and status ACTIVE
    const userQuery: any = { role: "PILOT", status: "ACTIVE" };

    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
      ];
    }

    if (city) {
      userQuery["location.city"] = { $regex: city, $options: "i" };
    }

    const pilots = await User.find(userQuery).select("-passwordHash").lean();
    const pilotUserIds = pilots.map((p) => p._id);

    const profileQuery: any = { userId: { $in: pilotUserIds } };
    if (serviceType) {
      profileQuery.specializations = { $regex: serviceType, $options: "i" };
    }

    const profiles = await PilotProfile.find(profileQuery).lean();
    const profileMap = new Map(profiles.map((pr) => [pr.userId.toString(), pr]));

    // Find certifications
    const now = new Date();
    const certs = await Certification.find({
      pilotId: { $in: pilotUserIds },
    }).lean();

    const certMap = new Map<string, any[]>();
    certs.forEach((c) => {
      const pid = c.pilotId.toString();
      if (!certMap.has(pid)) certMap.set(pid, []);
      certMap.get(pid)!.push(c);
    });

    const results = pilots
      .filter((pilot) => profileMap.has(pilot._id.toString()))
      .map((pilot) => {
        const pid = pilot._id.toString();
        const profile = profileMap.get(pid);
        const userCerts = certMap.get(pid) || [];
        const isVerified = userCerts.some(
          (c) => c.status === "VERIFIED" && new Date(c.expiryDate) > now
        );

        return {
          ...pilot,
          profile,
          certifications: userCerts,
          isVerified,
        };
      });

    const finalResults = verifiedOnly
      ? results.filter((p) => p.isVerified)
      : results;

    return NextResponse.json({ pilots: finalResults });
  } catch (error: any) {
    console.error("Fetch pilots error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
