export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuthUser } from "@/lib/permissions";
import { Payment } from "@/models/Payment";
import { Job } from "@/models/Job";
import { User } from "@/models/User";

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

    const paidPayments = await Payment.find(query)
      .populate("jobId", "title serviceType location budget agreedAmount date status approvalStatus")
      .populate("companyId", "name email phone profileImage")
      .populate("pilotId", "name email phone profileImage")
      .sort({ createdAt: -1 })
      .lean();

    let totalEarnings = 0;
    let pendingEarnings = 0;
    let completedPaymentsCount = 0;
    let totalSpending = 0;
    let allRecords: any[] = [...paidPayments];

    if (auth.user.role === "PILOT") {
      totalEarnings = paidPayments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      completedPaymentsCount = paidPayments.filter((p) => p.status === "PAID").length;

      // Pending earnings from active/assigned jobs
      const assignedJobs = await Job.find({
        assignedPilotId: auth.user.id,
        status: { $in: ["PILOT_SELECTED", "IN_PROGRESS", "COMPLETED"] },
      })
        .populate("companyId", "name email phone profileImage")
        .sort({ updatedAt: -1 })
        .lean();

      const paidJobIds = new Set(
        paidPayments
          .filter((p) => p.status === "PAID")
          .map((p: any) => p.jobId?._id?.toString() || p.jobId?.toString())
      );

      const pendingJobs = assignedJobs.filter(
        (j) => !paidJobIds.has(j._id.toString())
      );

      pendingEarnings = pendingJobs.reduce(
        (sum, j) => sum + (j.agreedAmount || j.budget || 0),
        0
      );

      // Create ledger rows for pending milestones
      const pendingRecords = pendingJobs.map((j) => ({
        _id: `pending-${j._id}`,
        jobId: {
          _id: j._id,
          title: j.title,
          serviceType: j.serviceType,
          budget: j.budget,
          agreedAmount: j.agreedAmount || j.budget,
          status: j.status,
          approvalStatus: j.approvalStatus || (j.status === "COMPLETED" ? "APPROVED" : "NOT_SUBMITTED"),
        },
        companyId: j.companyId || { name: "Client" },
        pilotId: { _id: auth.user.id, name: auth.user.name },
        amount: j.agreedAmount || j.budget,
        status: "PENDING",
        transactionId: j.approvalStatus === "APPROVED" ? "AWAITING-PAYMENT" : "ESCROW-LOCKED",
        paymentMethod: "Escrow Direct Transfer",
        createdAt: j.updatedAt || j.createdAt,
      }));

      // Combine so pilot sees both completed and pending payments in the ledger
      allRecords = [...paidPayments, ...pendingRecords];
    } else if (auth.user.role === "COMPANY") {
      totalSpending = paidPayments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      completedPaymentsCount = paidPayments.filter((p) => p.status === "PAID").length;

      // Calculate company pending payouts for approved or completed missions
      const companyAssignedJobs = await Job.find({
        companyId: auth.user.id,
        status: { $in: ["PILOT_SELECTED", "IN_PROGRESS", "COMPLETED"] },
      }).lean();

      const paidJobIds = new Set(
        paidPayments
          .filter((p) => p.status === "PAID")
          .map((p: any) => p.jobId?._id?.toString() || p.jobId?.toString())
      );

      const pendingCompanyJobs = companyAssignedJobs.filter(
        (j) => !paidJobIds.has(j._id.toString())
      );

      pendingEarnings = pendingCompanyJobs.reduce(
        (sum, j) => sum + (j.agreedAmount || j.budget || 0),
        0
      );
    }

    return NextResponse.json({
      payments: allRecords,
      totalEarnings,
      pendingEarnings,
      completedPaymentsCount,
      totalSpending,
    });
  } catch (error: any) {
    console.error("Fetch my payments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
