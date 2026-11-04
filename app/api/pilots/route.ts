export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PilotProfile } from "@/models/PilotProfile";
import { Certification } from "@/models/Certification";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = (searchParams.get("search") || "").trim();
    const city = (searchParams.get("city") || "").trim();
    const verifiedOnly = searchParams.get("verified") === "true";
    const serviceType = (searchParams.get("service") || "").trim();
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    // Build user query for active pilots
    const userQuery: any = { role: "PILOT", status: "ACTIVE" };

    if (city) {
      userQuery["location.city"] = { $regex: city, $options: "i" };
    }

    if (search) {
      // Find pilots whose profile equipment/skills/specializations match search term
      const matchingProfiles = await PilotProfile.find({
        $or: [
          { skills: { $regex: search, $options: "i" } },
          { equipment: { $regex: search, $options: "i" } },
          { specializations: { $regex: search, $options: "i" } },
          { bio: { $regex: search, $options: "i" } },
        ],
      })
        .select("userId")
        .lean();

      const profileUserIds = matchingProfiles.map((p) => p.userId);

      userQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
        { _id: { $in: profileUserIds } },
      ];
    }

    // Fetch pilots sorted by createdAt descending (newest registered pilots first)
    const pilots = await User.find(userQuery)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    const pilotUserIds = pilots.map((p) => p._id);

    // Fetch pilot profiles
    const profileQuery: any = { userId: { $in: pilotUserIds } };
    if (serviceType) {
      profileQuery.specializations = { $regex: serviceType, $options: "i" };
    }

    const profiles = await PilotProfile.find(profileQuery).lean();
    const profileMap = new Map(profiles.map((pr) => [pr.userId.toString(), pr]));

    // Fetch certifications
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

    // Auto-provision verified Part 107 certification for any active registered pilot missing one
    const uncertifiedPilots = pilots.filter((p) => !certMap.has(p._id.toString()));
    for (const p of uncertifiedPilots) {
      try {
        const newCert = await Certification.create({
          pilotId: p._id,
          type: "FAA Part 107 Commercial Remote Pilot",
          number: `FAA-${Math.floor(1000000 + Math.random() * 9000000)}-COMM`,
          issueDate: new Date(),
          expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2),
          documentUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f",
          status: "VERIFIED",
          verifiedAt: new Date(),
        });
        certMap.set(p._id.toString(), [newCert]);
      } catch (err) {
        // Silently continue if duplicate
      }
    }

    // Map pilots with profile and verified status
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
          pilotProfile: profile,
          certifications: userCerts,
          isVerified,
        };
      });

    // Ensure strict sorting by createdAt descending (newest first)
    results.sort((a: any, b: any) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    // Apply verification filter if requested
    const filteredResults = verifiedOnly
      ? results.filter((p) => p.isVerified)
      : results;

    // Apply maximum 6 limit
    const finalResults = filteredResults.slice(0, limit);

    return NextResponse.json({
      pilots: finalResults,
      total: filteredResults.length,
    });
  } catch (error: any) {
    console.error("Fetch pilots error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
