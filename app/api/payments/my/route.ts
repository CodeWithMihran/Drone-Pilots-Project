import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuthUser } from "@/lib/permissions";
import { Payment } from "@/models/Payment";
import { Job } from "@/models/Job";
import "@/models/User";

export async function GET() {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    await connectToDatabase();

    let query: any = {};
    if (auth.user.role === "PILOT") {
      query.pilotId = auth.user.id;
    } else if (auth.user.role === "COMPANY") {
      query.companyId = auth.user.id;
    }

    const payments = await Payment.find(query)
      .populate("jobId", "title serviceType location budget date status")
      .populate("companyId", "name email phone profileImage")
      .populate("pilotId", "name email phone profileImage")
      .sort({ createdAt: -1 })
      .lean();

    let totalEarnings = 0;
    let pendingEarnings = 0;
    let totalSpending = 0;

    if (auth.user.role === "PILOT") {
      totalEarnings = payments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      // Pending earnings from active/assigned jobs
      const activeJobs = await Job.find({
        assignedPilotId: auth.user.id,
        status: { $in: ["PILOT_SELECTED", "IN_PROGRESS", "COMPLETED"] },
      }).lean();

      const paidJobIds = new Set(payments.map((p: any) => p.jobId?._id?.toString() || p.jobId?.toString()));
      pendingEarnings = activeJobs
        .filter((j) => !paidJobIds.has(j._id.toString()))
        .reduce((sum, j) => sum + (j.budget || 0), 0);
    } else if (auth.user.role === "COMPANY") {
      totalSpending = payments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + (p.amount || 0), 0);
    }

    return NextResponse.json({
      payments,
      totalEarnings,
      pendingEarnings,
      totalSpending,
    });
  } catch (error: any) {
    console.error("Fetch my payments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
