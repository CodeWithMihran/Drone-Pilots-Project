import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthSession, requireAuthUser } from "@/lib/permissions";
import { Job } from "@/models/Job";
import { User } from "@/models/User";
import { CompanyProfile } from "@/models/CompanyProfile";
import { PilotProfile } from "@/models/PilotProfile";
import { Certification } from "@/models/Certification";
import { Application } from "@/models/Application";
import { Review } from "@/models/Review";
import { Notification } from "@/models/Notification";
import { calculateMatchScore } from "@/lib/matching";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    const job = await Job.findById(id)
      .populate("companyId", "name email phone profileImage location")
      .populate("assignedPilotId", "name email phone profileImage location")
      .lean();

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const companyProfile = await CompanyProfile.findOne({
      userId: (job.companyId as any)._id || job.companyId,
    }).lean();

    const applicationsCount = await Application.countDocuments({ jobId: job._id });

    // Check if session user is pilot, whether already applied, compute match score
    const sessionUser = await getAuthSession();
    let existingApplication: any = null;
    let matchResult: any = null;
    let pilotCerts: any[] = [];
    let isPilotVerified = false;
    let hasReviewed = false;

    if (sessionUser) {
      if (sessionUser.role === "PILOT") {
        existingApplication = await Application.findOne({
          jobId: job._id,
          pilotId: sessionUser.id,
        }).lean();

        const pilotProfile = await PilotProfile.findOne({ userId: sessionUser.id }).lean();
        const pilotUser = await User.findById(sessionUser.id).lean();
        pilotCerts = await Certification.find({ pilotId: sessionUser.id }).lean();

        const now = new Date();
        isPilotVerified = pilotCerts.some(
          (c) => c.status === "VERIFIED" && new Date(c.expiryDate) > now
        );

        if (pilotProfile && pilotUser) {
          matchResult = calculateMatchScore(
            {
              userId: sessionUser.id,
              experience: pilotProfile.experience,
              skills: pilotProfile.skills,
              equipment: pilotProfile.equipment,
              availability: pilotProfile.availability,
              serviceAreas: pilotProfile.serviceAreas,
              location: pilotUser.location,
              certifications: pilotCerts.map((c) => ({
                type: c.type,
                status: c.status,
                expiryDate: c.expiryDate,
              })),
            },
            {
              serviceType: job.serviceType,
              location: job.location,
              requiredCertification: job.requiredCertification,
              requiredExperience: job.requiredExperience,
              requiredEquipment: job.requiredEquipment,
            }
          );
        }
      }

      // Check if user has already left a review for this job
      const review = await Review.findOne({
        jobId: job._id,
        reviewerId: sessionUser.id,
      }).lean();
      if (review) hasReviewed = true;
    }

    return NextResponse.json({
      job: {
        ...job,
        companyProfile,
        applicationsCount,
        existingApplication,
        matchResult,
        isPilotVerified,
        hasReviewed,
      },
    });
  } catch (error: any) {
    console.error("Get job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = params;
    await connectToDatabase();

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status, title, description, budget, requiredEquipment, requirements } = body;

    const isCompanyOwner = job.companyId.toString() === auth.user.id;
    const isAssignedPilot = job.assignedPilotId?.toString() === auth.user.id;
    const isAdmin = auth.user.role === "ADMIN";

    if (!isCompanyOwner && !isAssignedPilot && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. You cannot modify this job." },
        { status: 403 }
      );
    }

    // Role-based workflow validation:
    if (status) {
      // Pilot can only update to IN_PROGRESS or COMPLETED if assigned
      if (isAssignedPilot && !isCompanyOwner && !isAdmin) {
        if (status !== "IN_PROGRESS" && status !== "COMPLETED") {
          return NextResponse.json(
            { error: "Assigned pilot can only update progress to IN_PROGRESS or COMPLETED." },
            { status: 403 }
          );
        }
      }

      // Company or Admin can cancel, complete, or re-open
      job.status = status;

      // Send status update notification
      if (job.assignedPilotId) {
        const notifyTarget = isCompanyOwner ? job.assignedPilotId : job.companyId;
        await Notification.create({
          userId: notifyTarget,
          title: `Job Status: ${job.title}`,
          message: `Job status was updated to ${status.replace(/_/g, " ")}.`,
          type: "JOB",
          link: `/jobs/${job._id}`,
        });
      }
    }

    // Edit fields allowed for company owner
    if (isCompanyOwner || isAdmin) {
      if (title) job.title = title;
      if (description) job.description = description;
      if (budget) job.budget = budget;
      if (requiredEquipment) job.requiredEquipment = requiredEquipment;
      if (requirements) job.requirements = requirements;
    }

    await job.save();

    return NextResponse.json({
      message: "Job updated successfully!",
      job,
    });
  } catch (error: any) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = params;
    await connectToDatabase();

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const isCompanyOwner = job.companyId.toString() === auth.user.id;
    const isAdmin = auth.user.role === "ADMIN";

    if (!isCompanyOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. You can only delete your own jobs." },
        { status: 403 }
      );
    }

    // Set job to CANCELLED
    job.status = "CANCELLED";
    await job.save();

    return NextResponse.json({ message: "Job cancelled successfully." });
  } catch (error: any) {
    console.error("Delete job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
