import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PasswordResetToken } from "@/models/PasswordResetToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, email, password } = body ?? {};

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 1. If email is provided (from authenticated Supabase updateUser flow)
    if (email && typeof email === "string") {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (user) {
        user.passwordHash = await bcrypt.hash(password, 12);
        await user.save();
      }
      return NextResponse.json({
        message: "Password updated successfully in database.",
      });
    }

    // 2. Fallback for token-based request
    if (token && typeof token === "string") {
      const resetRecord = await PasswordResetToken.findOne({ token });
      if (!resetRecord || resetRecord.used || new Date() > resetRecord.expiresAt) {
        return NextResponse.json(
          { error: "This reset link is invalid or has expired. Please request a new one." },
          { status: 400 }
        );
      }

      const user = await User.findById(resetRecord.userId);
      if (user) {
        user.passwordHash = await bcrypt.hash(password, 12);
        await user.save();
        resetRecord.used = true;
        await resetRecord.save();
      }

      return NextResponse.json({
        message: "Your password has been updated successfully. You can now sign in.",
      });
    }

    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
