import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuthUser } from "@/lib/permissions";
import { Certification } from "@/models/Certification";
import { User } from "@/models/User";
import { Notification } from "@/models/Notification";
import { CertificationUploadSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query: any = {};

    if (auth.user.role === "PILOT") {
      query.pilotId = auth.user.id;
    } else if (auth.user.role === "ADMIN") {
      if (status && status !== "ALL") {
        query.status = status;
      }
    } else {
      return NextResponse.json(
        { error: "Forbidden. Access restricted." },
        { status: 403 }
      );
    }

    const certs = await Certification.find(query)
      .populate("pilotId", "name email phone profileImage location")
      .populate("verifiedBy", "name email")
      .sort({ createdAt: -1 })
      .lean();

    // Auto-update expired certifications
    const now = new Date();
    const updatedCerts = certs.map((c: any) => {
      if (c.status === "VERIFIED" && new Date(c.expiryDate) < now) {
        c.status = "EXPIRED";
      }
      return c;
    });

    return NextResponse.json({ certifications: updatedCerts });
  } catch (error: any) {
    console.error("Fetch certifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    if (auth.user.role !== "PILOT") {
      return NextResponse.json(
        { error: "Only pilots can upload certification credentials." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validation = CertificationUploadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { type, number, issueDate, expiryDate, documentUrl } = validation.data;

    await connectToDatabase();

    const cert = await Certification.create({
      pilotId: auth.user.id,
      type,
      number,
      issueDate: new Date(issueDate),
      expiryDate: new Date(expiryDate),
      documentUrl,
      status: "PENDING",
    });

    // Notify admins of pending certification
    const admins = await User.find({ role: "ADMIN", status: "ACTIVE" }).lean();
    for (const admin of admins) {
      await Notification.create({
        userId: admin._id,
        title: "New Pilot Certification Uploaded",
        message: `${auth.user.name} submitted a ${type} (${number}) for verification.`,
        type: "CERTIFICATION",
        link: "/admin/certifications",
      });
    }

    // Confirmation notification to pilot
    await Notification.create({
      userId: auth.user.id,
      title: "Certification Submitted",
      message: "Your document is in the verification queue. Admin review typically takes 12-24 hours.",
      type: "CERTIFICATION",
      link: "/pilot/certification",
    });

    return NextResponse.json(
      {
        message: "Certification submitted successfully for review.",
        certification: cert,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload certification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
