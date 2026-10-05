import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthSession } from "@/lib/permissions";
import { User } from "@/models/User";
import { PilotProfile } from "@/models/PilotProfile";
import { CompanyProfile } from "@/models/CompanyProfile";
import { Certification } from "@/models/Certification";

export async function GET() {
  try {
    const sessionUser = await getAuthSession();
    if (!sessionUser) {
      return NextResponse.json({ user: null });
    }

    await connectToDatabase();
    const user = await User.findById(sessionUser.id).select("-passwordHash").lean();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    let profile: any = null;
    let isVerified = false;
    let latestCertification: any = null;

    if (user.role === "PILOT") {
      profile = await PilotProfile.findOne({ userId: user._id }).lean();
      latestCertification = await Certification.findOne({ pilotId: user._id })
        .sort({ createdAt: -1 })
        .lean();

      if (latestCertification && latestCertification.status === "VERIFIED") {
        if (new Date(latestCertification.expiryDate) > new Date()) {
          isVerified = true;
        }
      }
    } else if (user.role === "COMPANY") {
      profile = await CompanyProfile.findOne({ userId: user._id }).lean();
    }

    return NextResponse.json({
      user: {
        ...user,
        profile,
        isVerified,
        latestCertification,
      },
    });
  } catch (error: any) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
