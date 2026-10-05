import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { Certification } from "@/models/Certification";
import { Notification } from "@/models/Notification";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireRole(["ADMIN"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = params;
    await connectToDatabase();

    const cert = await Certification.findById(id);
    if (!cert) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    cert.status = "VERIFIED";
    cert.verifiedBy = auth.user.id as any;
    cert.verifiedAt = new Date();
    cert.rejectionReason = "";
    await cert.save();

    // Send verification badge notification to pilot
    await Notification.create({
      userId: cert.pilotId,
      title: "Certification Verified! ✓",
      message: `Your ${cert.type} (License: ${cert.number}) has been approved! You now display the ✓ VERIFIED PILOT badge and can apply to all commercial projects.`,
      type: "CERTIFICATION",
      link: "/pilot/certification",
    });

    return NextResponse.json({
      message: "Pilot certification verified successfully!",
      certification: cert,
    });
  } catch (error: any) {
    console.error("Verify certification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
