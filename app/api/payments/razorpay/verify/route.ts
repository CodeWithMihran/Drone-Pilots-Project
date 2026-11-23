export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { Job } from "@/models/Job";
import { Payment } from "@/models/Payment";
import { Notification } from "@/models/Notification";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole(["COMPANY"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const { jobId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!jobId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        {
          error:
            "Missing required payment verification parameters (jobId, razorpayOrderId, razorpayPaymentId, razorpaySignature).",
        },
        { status: 400 }
      );
    }

    // Cryptographic HMAC SHA256 signature verification
    const isValidSignature = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Payment verification failed: Invalid cryptographic signature from Razorpay." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const job = await Job.findById(jobId);
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

    // Check if already paid with this payment ID or already completed
    const existingPayment = await Payment.findOne({
      $or: [{ razorpayPaymentId }, { jobId: job._id, status: "PAID" }],
    });

    if (existingPayment) {
      // Idempotency: Return existing payment if already processed
      return NextResponse.json({
        success: true,
        message: "Payment was already verified and recorded.",
        payment: existingPayment,
      });
    }

    const finalAmount = job.agreedAmount || job.budget || 0;
    const currency = process.env.RAZORPAY_CURRENCY || "INR";

    const payment = await Payment.create({
      jobId: job._id,
      companyId: auth.user.id,
      pilotId: job.assignedPilotId,
      applicationId: job.acceptedApplicationId,
      amount: finalAmount,
      currency,
      status: "PAID",
      transactionId: razorpayPaymentId,
      paymentMethod: "Razorpay Gateway",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      notes: `Approved mission milestone payout via Razorpay. (Order: ${razorpayOrderId})`,
    });

    // Update job payment status
    job.paymentStatus = "PAID";
    await job.save();

    // Notify Pilot
    await Notification.create({
      userId: job.assignedPilotId,
      title: "Payment Received! 💰",
      message: `You received a payout of ₹${finalAmount.toLocaleString()} for completing "${job.title}". (Razorpay Ref: ${razorpayPaymentId})`,
      type: "PAYMENT",
      link: "/pilot/earnings",
    });

    // Notify Company
    await Notification.create({
      userId: auth.user.id,
      title: "Payment Successful! 💳",
      message: `Payout of ₹${finalAmount.toLocaleString()} has been successfully processed for "${job.title}". (Razorpay Ref: ${razorpayPaymentId})`,
      type: "PAYMENT",
      link: `/jobs/${job._id}`,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Payment successfully verified and released to pilot!",
        payment,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Razorpay payment verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify and record payment." },
      { status: 500 }
    );
  }
}
