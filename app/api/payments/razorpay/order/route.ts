export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { Job } from "@/models/Job";
import { Payment } from "@/models/Payment";
import { getRazorpayClient } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole(["COMPANY"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "Mission ID (jobId) is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const job = await Job.findById(jobId)
      .populate("companyId", "name email phone")
      .populate("assignedPilotId", "name email phone");

    if (!job) {
      return NextResponse.json({ error: "Mission not found." }, { status: 404 });
    }

    const companyIdStr = (job.companyId as any)?._id?.toString() || job.companyId?.toString();
    if (companyIdStr !== auth.user.id) {
      return NextResponse.json(
        { error: "Unauthorized. You can only release payouts for your own missions." },
        { status: 403 }
      );
    }

    if (!job.assignedPilotId) {
      return NextResponse.json(
        { error: "No pilot is assigned to receive payment for this mission." },
        { status: 400 }
      );
    }

    if (job.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payment can only be released after the flight mission is marked COMPLETED." },
        { status: 400 }
      );
    }

    if (job.approvalStatus !== "APPROVED") {
      return NextResponse.json(
        { error: "Payment can only be released after company approves the completed mission deliverables." },
        { status: 400 }
      );
    }

    if (job.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "Payment has already been completed for this mission." },
        { status: 409 }
      );
    }

    const existingPayment = await Payment.findOne({
      jobId: job._id,
      status: "PAID",
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment has already been recorded for this mission." },
        { status: 409 }
      );
    }

    const payableAmount = job.agreedAmount || job.budget || 0;
    if (payableAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount. Amount must be greater than zero." },
        { status: 400 }
      );
    }

    const currency = process.env.RAZORPAY_CURRENCY || "INR";
    const amountInSmallestUnit = Math.round(payableAmount * 100);

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: amountInSmallestUnit,
      currency,
      receipt: `rcpt_${job._id.toString().slice(-10)}`,
      notes: {
        jobId: job._id.toString(),
        missionTitle: job.title.slice(0, 40),
        pilotId: ((job.assignedPilotId as any)?._id || job.assignedPilotId).toString(),
        companyId: auth.user.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      jobTitle: job.title,
      pilotName: (job.assignedPilotId as any)?.name || "Assigned Pilot",
      pilotEmail: (job.assignedPilotId as any)?.email || "",
      payableAmount,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Razorpay payment order." },
      { status: 500 }
    );
  }
}
