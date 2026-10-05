import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuthUser } from "@/lib/permissions";
import { Job } from "@/models/Job";
import { Application } from "@/models/Application";
import { PilotProfile } from "@/models/PilotProfile";
import { Certification } from "@/models/Certification";
import "@/models/User";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = params;
    await connectToDatabase();

    const job = await Job.findById(id).lean();
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const isCompanyOwner = job.companyId.toString() === auth.user.id;
    const isAdmin = auth.user.role === "ADMIN";

    if (!isCompanyOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. You cannot view applications for this job." },
        { status: 403 }
      );
    }

    const applications = await Application.find({ jobId: id })
      .populate("pilotId", "name email phone profileImage location")
      .sort({ matchScore: -1, createdAt: -1 })
      .lean();

    // Enrich with pilot profile & verified certifications
    const pilotIds = applications.map((a: any) => a.pilotId?._id || a.pilotId);
    const profiles = await PilotProfile.find({ userId: { $in: pilotIds } }).lean();
    const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

    const now = new Date();
    const certs = await Certification.find({ pilotId: { $in: pilotIds } }).lean();
    const certMap = new Map<string, any[]>();
    certs.forEach((c) => {
      const pid = c.pilotId.toString();
      if (!certMap.has(pid)) certMap.set(pid, []);
      certMap.get(pid)!.push(c);
    });

    const enrichedApplications = applications.map((app: any) => {
      const pid = (app.pilotId?._id || app.pilotId).toString();
      const profile = profileMap.get(pid);
      const userCerts = certMap.get(pid) || [];
      const isVerified = userCerts.some(
        (c) => c.status === "VERIFIED" && new Date(c.expiryDate) > now
      );

      return {
        ...app,
        pilotProfile: profile,
        certifications: userCerts,
        isVerified,
      };
    });

    return NextResponse.json({ applications: enrichedApplications, total: enrichedApplications.length });
  } catch (error: any) {
    console.error("Fetch job applications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
