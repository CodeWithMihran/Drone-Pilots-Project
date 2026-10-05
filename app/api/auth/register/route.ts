import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PilotProfile } from "@/models/PilotProfile";
import { CompanyProfile } from "@/models/CompanyProfile";
import { Notification } from "@/models/Notification";
import { RegisterSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      role,
      phone,
      city,
      state,
      country,
      companyName,
      industry,
    } = validation.data;

    // Security check: Only PILOT or COMPANY can be registered publicly
    if (role !== "PILOT" && role !== "COMPANY") {
      return NextResponse.json(
        { error: "Public registration is only available for Pilots and Companies." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      phone: phone || "",
      location: {
        city,
        state,
        country: country || "United States",
      },
      status: "ACTIVE",
    });

    if (role === "PILOT") {
      await PilotProfile.create({
        userId: newUser._id,
        experience: 1,
        skills: ["Commercial Drone Pilot", "Aerial Mapping", "Photography"],
        specializations: ["Real Estate Mapping", "Aerial Photography"],
        equipment: ["DJI Mavic 3 Pro", "DJI Air 3"],
        availability: "AVAILABLE",
        serviceAreas: [`${city}, ${state}`],
        rate: 75,
        rating: 5.0,
        totalReviews: 0,
        bio: `Licensed commercial drone operator based in ${city}, ${state}.`,
      });

      await Notification.create({
        userId: newUser._id,
        title: "Welcome to Certified Drone Pilots!",
        message: "Please upload your Part 107 certification to become a Verified Pilot and unlock high-paying jobs.",
        type: "SYSTEM",
        link: "/pilot/certification",
      });
    } else if (role === "COMPANY") {
      await CompanyProfile.create({
        userId: newUser._id,
        companyName: companyName || `${name}'s Organization`,
        contactPerson: name,
        industry: industry || "Commercial Services",
        website: "",
        description: `Industrial operations and drone services management for ${companyName || name}.`,
        rating: 5.0,
        totalReviews: 0,
      });

      await Notification.create({
        userId: newUser._id,
        title: "Welcome to Certified Drone Pilots!",
        message: "You can now post your first drone project and receive verified pilot proposals.",
        type: "SYSTEM",
        link: "/company/post-job",
      });
    }

    return NextResponse.json(
      {
        message: "Registration successful! You may now sign in.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register account. Please try again." },
      { status: 500 }
    );
  }
}
