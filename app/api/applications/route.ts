import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { Job } from "@/models/Job";
import { User } from "@/models/User";
import { PilotProfile } from "@/models/PilotProfile";
import { Certification } from "@/models/Certification";
import { Application } from "@/models/Application";
import { Notification } from "@/models/Notification";
import { ApplicationSchema } from "@/lib/validations";
import { calculateMatchScore } from "@/lib/matching";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole(["PILOT"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const validation = ApplicationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { jobId, proposal, bidAmount, availability } = validation.data;

    await connectToDatabase();

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    if (job.status !== "OPEN" && job.status !== "APPLICATIONS_RECEIVED") {
      return NextResponse.json(
        { error: `Job is currently ${job.status.replace(/_/g, " ")} and no longer accepting applications.` },
        { status: 400 }
      );
    }

    // Check if application deadline has passed
    if (new Date(job.applicationDeadline) < new Date()) {
      return NextResponse.json(
        { error: "Application deadline has passed for this job." },
        { status: 400 }
      );
    }

    // Check duplicate application
    const existing = await Application.findOne({
      jobId: job._id,
      pilotId: auth.user.id,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted an application for this job." },
        { status: 409 }
      );
    }

    // Check verification status
    const certs = await Certification.find({ pilotId: auth.user.id }).lean();
    const now = new Date();
    const isVerified = certs.some(
      (c) => c.status === "VERIFIED" && new Date(c.expiryDate) > now
    );

    if (job.requiredCertification && !isVerified) {
      return NextResponse.json(
        {
          error:
            "This job requires a verified commercial pilot certificate. Please upload and verify your certification first.",
        },
        { status: 403 }
      );
    }

    // Calculate match score
    const pilotProfile = await PilotProfile.findOne({ userId: auth.user.id }).lean();
    const pilotUser = await User.findById(auth.user.id).lean();

    let matchScore = 70;
    if (pilotProfile && pilotUser) {
      const matchResult = calculateMatchScore(
        {
          userId: auth.user.id,
          experience: pilotProfile.experience,
          skills: pilotProfile.skills,
          equipment: pilotProfile.equipment,
          availability: pilotProfile.availability,
          serviceAreas: pilotProfile.serviceAreas,
          location: pilotUser.location,
          certifications: certs.map((c) => ({
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
      matchScore = matchResult.score;
    }

    const application = await Application.create({
      jobId: job._id,
      pilotId: auth.user.id,
      proposal,
      bidAmount,
      availability,
      matchScore,
      status: "PENDING",
    });

    // Update job status to APPLICATIONS_RECEIVED if was OPEN
    if (job.status === "OPEN") {
      job.status = "APPLICATIONS_RECEIVED";
      await job.save();
    }

    // Notify company owner
    await Notification.create({
      userId: job.companyId,
      title: "New Job Proposal Received",
      message: `${auth.user.name} submitted a ${matchScore}% match proposal for "${job.title}".`,
      type: "APPLICATION",
      link: `/company/applications?jobId=${job._id}`,
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully!",
        application,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Submit application error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
