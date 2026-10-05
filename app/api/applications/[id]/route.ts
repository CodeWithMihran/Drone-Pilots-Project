import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuthUser } from "@/lib/permissions";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";
import { Notification } from "@/models/Notification";
import { ApplicationStatusSchema } from "@/lib/validations";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = params;
    const body = await req.json();

    const validation = ApplicationStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { status, notes } = validation.data;

    await connectToDatabase();

    const application = await Application.findById(id).populate("jobId");
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      return NextResponse.json({ error: "Associated job not found" }, { status: 404 });
    }

    const isCompanyOwner = job.companyId.toString() === auth.user.id;
    const isApplicant = application.pilotId.toString() === auth.user.id;
    const isAdmin = auth.user.role === "ADMIN";

    // Only applicant can withdraw
    if (status === "WITHDRAWN" && !isApplicant && !isAdmin) {
      return NextResponse.json(
        { error: "Only the applicant can withdraw this proposal." },
        { status: 403 }
      );
    }

    // Only company owner or admin can shortlist, accept, reject
    if (
      (status === "SHORTLISTED" || status === "ACCEPTED" || status === "REJECTED") &&
      !isCompanyOwner &&
      !isAdmin
    ) {
      return NextResponse.json(
        { error: "Only the hiring company can accept or reject applications." },
        { status: 403 }
      );
    }

    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    // If accepted, assign pilot and move job to PILOT_SELECTED
    if (status === "ACCEPTED") {
      job.status = "PILOT_SELECTED";
      job.assignedPilotId = application.pilotId;
      await job.save();

      // Notify the accepted pilot
      await Notification.create({
        userId: application.pilotId,
        title: "Proposal Accepted! 🎉",
        message: `Your proposal for "${job.title}" has been accepted! You are now the assigned pilot for this project.`,
        type: "APPLICATION",
        link: `/pilot/active-jobs`,
      });
    } else if (status === "SHORTLISTED") {
      await Notification.create({
        userId: application.pilotId,
        title: "Proposal Shortlisted ⭐",
        message: `Your application for "${job.title}" has been shortlisted by the client.`,
        type: "APPLICATION",
        link: `/pilot/applications`,
      });
    } else if (status === "REJECTED") {
      await Notification.create({
        userId: application.pilotId,
        title: "Application Status Update",
        message: `The client chose another candidate for "${job.title}". Thank you for submitting.`,
        type: "APPLICATION",
        link: `/pilot/applications`,
      });
    }

    return NextResponse.json({
      message: `Application marked as ${status.toLowerCase()}.`,
      application,
    });
  } catch (error: any) {
    console.error("Update application status error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
