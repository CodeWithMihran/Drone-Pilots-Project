import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuthUser } from "@/lib/permissions";
import { Notification } from "@/models/Notification";

export async function PUT() {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    await connectToDatabase();

    await Notification.updateMany(
      { userId: auth.user.id, read: false },
      { read: true }
    );

    return NextResponse.json({ message: "All notifications marked as read." });
  } catch (error: any) {
    console.error("Mark all read error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
