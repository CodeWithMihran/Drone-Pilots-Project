import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuthUser } from "@/lib/permissions";
import { Notification } from "@/models/Notification";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = params;
    await connectToDatabase();

    const notif = await Notification.findOneAndUpdate(
      { _id: id, userId: auth.user.id },
      { read: true },
      { new: true }
    );

    if (!notif) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Marked as read", notification: notif });
  } catch (error: any) {
    console.error("Mark notification read error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
