import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuthUser } from "@/lib/permissions";
import { Notification } from "@/models/Notification";

export async function GET() {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    await connectToDatabase();

    const notifications = await Notification.find({ userId: auth.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const unreadCount = await Notification.countDocuments({
      userId: auth.user.id,
      read: false,
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
