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
    const body = await req.json();
    const rejectionReason = body.rejectionReason || "Uploaded document was illegible or could not be verified with the regulatory authority.";

    await connectToDatabase();

    const cert = await Certification.findById(id);
    if (!cert) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    cert.status = "REJECTED";
    cert.rejectionReason = rejectionReason;
    cert.verifiedBy = auth.user.id as any;
    cert.verifiedAt = new Date();
    await cert.save();

    // Send rejection notification to pilot
    await Notification.create({
      userId: cert.pilotId,
      title: "Certification Verification Unsuccessful",
      message: `Your ${cert.type} was not approved. Reason: ${rejectionReason}. You may re-upload a clear document.`,
      type: "CERTIFICATION",
      link: "/pilot/certification",
    });

    return NextResponse.json({
      message: "Certification marked as rejected.",
      certification: cert,
    });
  } catch (error: any) {
    console.error("Reject certification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
