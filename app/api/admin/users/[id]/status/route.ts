import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { User } from "@/models/User";
import { Notification } from "@/models/Notification";
import { AdminUserStatusSchema } from "@/lib/validations";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireRole(["ADMIN"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = params;
    const body = await req.json();

    const validation = AdminUserStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { status } = validation.data;

    await connectToDatabase();

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "ADMIN" && targetUser._id.toString() === auth.user.id) {
      return NextResponse.json(
        { error: "You cannot suspend your own admin account." },
        { status: 400 }
      );
    }

    targetUser.status = status;
    await targetUser.save();

    await Notification.create({
      userId: targetUser._id,
      title: status === "ACTIVE" ? "Account Re-activated" : "Account Suspended",
      message:
        status === "ACTIVE"
          ? "Your account has been reactivated. You have full access to platform operations."
          : "Your account has been suspended by administration. Restricted actions are blocked.",
      type: "SYSTEM",
      link: targetUser.role === "PILOT" ? "/pilot/settings" : "/company/settings",
    });

    return NextResponse.json({
      message: `User status changed to ${status}.`,
      user: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        status: targetUser.status,
      },
    });
  } catch (error: any) {
    console.error("Change user status error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
