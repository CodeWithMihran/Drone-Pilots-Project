import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { Payment } from "@/models/Payment";
import { Job } from "@/models/Job";
import { Notification } from "@/models/Notification";
import { PaymentSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole(["COMPANY"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const validation = PaymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { jobId, amount, notes } = validation.data;

    await connectToDatabase();

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.companyId.toString() !== auth.user.id) {
      return NextResponse.json(
        { error: "Unauthorized. You can only release payment for your own projects." },
        { status: 403 }
      );
    }

    if (!job.assignedPilotId) {
      return NextResponse.json(
        { error: "No pilot is assigned to this project to receive payment." },
        { status: 400 }
      );
    }

    if (job.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Payments can only be released after the job is marked COMPLETED." },
        { status: 400 }
      );
    }

    // Check if already paid
    const existingPayment = await Payment.findOne({
      jobId: job._id,
      status: "PAID",
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment has already been issued for this completed project." },
        { status: 409 }
      );
    }

    const transactionId = `TXN-DRN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await Payment.create({
      jobId: job._id,
      companyId: auth.user.id,
      pilotId: job.assignedPilotId,
      amount,
      status: "PAID",
      transactionId,
      notes: notes || "Direct escrow simulated payout for completed flight operations.",
    });

    // Notify pilot
    await Notification.create({
      userId: job.assignedPilotId,
      title: "Payment Received! 💰",
      message: `You received a payout of $${amount.toLocaleString()} for completing "${job.title}". (Ref: ${transactionId})`,
      type: "PAYMENT",
      link: "/pilot/earnings",
    });

    return NextResponse.json(
      {
        message: "Payment successfully processed and released to pilot!",
        payment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Process payment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
