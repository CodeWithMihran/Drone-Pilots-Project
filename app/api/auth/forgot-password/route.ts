export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PasswordResetToken } from "@/models/PasswordResetToken";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body?.email ?? "").toLowerCase().trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const origin =
      req.nextUrl.origin ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    await connectToDatabase();

    const user = await User.findOne({ email });

    let resetLink: string | undefined;

    if (user) {
      // Generate a secure, unique reset token
      const token = crypto.randomBytes(32).toString("hex");

      // Invalidate any existing unused tokens for this user
      await PasswordResetToken.updateMany(
        { userId: user._id, used: false },
        { used: true }
      );

      // Create new token record with 1 hour expiration
      await PasswordResetToken.create({
        userId: user._id,
        email: user.email,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        used: false,
      });

      resetLink = `${origin}/reset-password?token=${token}`;

      // 1. Attempt to dispatch real email via SMTP if credentials exist
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 465,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
              user: process.env.SMTP_USER,
              pass: (process.env.SMTP_PASS || "").replace(/\s+/g, ""),
            },
            connectionTimeout: 5000,
            greetingTimeout: 5000,
          });

          await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || "Certified Drone Pilots"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            to: user.email,
            subject: "Reset your AeroLink password",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #faf9f6; border-radius: 16px; color: #111111;">
                <div style="margin-bottom: 24px;">
                  <span style="font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: #111111;">Aero<span style="color: #ffbd24;">Link</span></span>
                </div>
                <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 12px 0; color: #111111;">Reset your password</h2>
                <p style="font-size: 14px; line-height: 1.6; color: #555555; margin: 0 0 24px 0;">
                  We received a request to reset the password for your AeroLink account (<strong>${user.email}</strong>). Click the button below to choose a new password:
                </p>
                <div style="margin: 28px 0;">
                  <a href="${resetLink}" style="display: inline-block; background-color: #ffbd24; color: #111111; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 9999px; text-decoration: none; text-align: center;">
                    Reset Password
                  </a>
                </div>
                <p style="font-size: 12px; line-height: 1.5; color: #777777; margin: 0 0 8px 0;">
                  This link is valid for 1 hour. If you didn't request a password reset, you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #e8e4dc; margin: 24px 0;" />
                <p style="font-size: 11px; color: #999999; word-break: break-all; margin: 0;">
                  Button not working? Copy and paste this link into your browser:<br />
                  <a href="${resetLink}" style="color: #777777;">${resetLink}</a>
                </p>
              </div>
            `,
          });
        } catch (mailError) {
          console.warn("SMTP email dispatch warning:", mailError);
        }
      }

      // 2. Fallback Supabase call in try-catch so it never fails the request
      try {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/reset-password`,
        });
      } catch (_) {
        // Ignored
      }
    }

    return NextResponse.json({
      message:
        "If an account with that email exists, a password reset link has been sent to your email.",
      resetLink: process.env.NODE_ENV !== "production" ? resetLink : undefined,
    });
  } catch (error: any) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
