import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthSession, requireRole } from "@/lib/permissions";
import { Job } from "@/models/Job";
import { User } from "@/models/User";
import { PilotProfile } from "@/models/PilotProfile";
import { Certification } from "@/models/Certification";
import { Notification } from "@/models/Notification";
import { JobSchema } from "@/lib/validations";
import { calculateMatchScore } from "@/lib/matching";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const serviceType = searchParams.get("service") || "";
    const location = searchParams.get("location") || "";
    const budgetMin = searchParams.get("budgetMin");
    const budgetMax = searchParams.get("budgetMax");
    const experienceMax = searchParams.get("experience");
    const status = searchParams.get("status");
    const companyId = searchParams.get("companyId");
    const pilotId = searchParams.get("pilotId"); // for assigned jobs

    const query: any = {};

    if (companyId) {
      query.companyId = companyId;
    }

    if (pilotId) {
      query.assignedPilotId = pilotId;
    }

    if (status) {
      if (status !== "ALL") {
        query.status = status;
      }
    } else if (!companyId && !pilotId) {
      // By default for public marketplace, show open and active jobs
      query.status = { $in: ["OPEN", "APPLICATIONS_RECEIVED"] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.state": { $regex: search, $options: "i" } },
      ];
    }

    if (serviceType) {
      query.serviceType = serviceType.toUpperCase();
    }

    if (location) {
      query.$or = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } },
      ];
    }

    if (budgetMin || budgetMax) {
      query.budget = {};
      if (budgetMin) query.budget.$gte = Number(budgetMin);
      if (budgetMax) query.budget.$lte = Number(budgetMax);
    }

    if (experienceMax) {
      query.requiredExperience = { $lte: Number(experienceMax) };
    }

    const jobs = await Job.find(query)
      .populate("companyId", "name email phone profileImage location")
      .populate("assignedPilotId", "name email phone profileImage")
      .sort({ createdAt: -1 })
      .lean();

    // If current session is a PILOT, compute match score for each job
    const sessionUser = await getAuthSession();
    let enrichedJobs = jobs;

    if (sessionUser && sessionUser.role === "PILOT") {
      const pilotProfile = await PilotProfile.findOne({ userId: sessionUser.id }).lean();
      const pilotUser = await User.findById(sessionUser.id).lean();
      const certs = await Certification.find({ pilotId: sessionUser.id }).lean();

      if (pilotProfile && pilotUser) {
        const pilotMatchingData = {
          userId: sessionUser.id,
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
        };

        enrichedJobs = jobs.map((job: any) => {
          const matchResult = calculateMatchScore(pilotMatchingData, {
            serviceType: job.serviceType,
            location: job.location,
            requiredCertification: job.requiredCertification,
            requiredExperience: job.requiredExperience,
            requiredEquipment: job.requiredEquipment,
          });
          return {
            ...job,
            matchScore: matchResult.score,
            matchBreakdown: matchResult.breakdown,
            isEligible: matchResult.eligible,
          };
        });
      }
    }

    return NextResponse.json({ jobs: enrichedJobs, total: enrichedJobs.length });
  } catch (error: any) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole(["COMPANY"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const validation = JobSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      title,
      serviceType,
      description,
      city,
      state,
      country,
      address,
      date,
      startTime,
      duration,
      budget,
      requiredCertification,
      requiredExperience,
      requiredEquipment,
      requirements,
      applicationDeadline,
    } = validation.data;

    await connectToDatabase();

    const newJob = await Job.create({
      companyId: auth.user.id,
      title,
      serviceType,
      description,
      location: {
        city,
        state,
        country: country || "United States",
        address: address || "",
      },
      date: new Date(date),
      startTime: startTime || "09:00 AM",
      duration: duration || "1 Day",
      budget,
      requiredCertification,
      requiredExperience,
      requiredEquipment,
      requirements,
      applicationDeadline: new Date(applicationDeadline),
      status: "OPEN",
    });

    // Notify verified pilots with matching specialization or location
    const matchingPilots = await User.find({ role: "PILOT", status: "ACTIVE" })
      .limit(10)
      .lean();

    for (const pilot of matchingPilots) {
      await Notification.create({
        userId: pilot._id,
        title: "New Job Matching Your Field",
        message: `A new ${serviceType.replace(/_/g, " ")} job "${title}" in ${city}, ${state} is accepting proposals.`,
        type: "JOB",
        link: `/jobs/${newJob._id}`,
      });
    }

    return NextResponse.json(
      { message: "Job created and published successfully!", job: newJob },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
