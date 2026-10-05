import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { User } from "@/models/User";
import { PilotProfile } from "@/models/PilotProfile";
import { PilotProfileSchema } from "@/lib/validations";

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireRole(["PILOT"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const validation = PilotProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      name,
      phone,
      city,
      state,
      country,
      experience,
      skills,
      specializations,
      equipment,
      availability,
      serviceAreas,
      rate,
      bio,
      profileImage,
    } = validation.data;

    await connectToDatabase();

    // Update User model
    const userUpdate: any = {
      name,
      phone: phone || "",
      location: {
        city,
        state,
        country: country || "United States",
      },
    };
    if (profileImage) {
      userUpdate.profileImage = profileImage;
    }

    await User.findByIdAndUpdate(auth.user.id, userUpdate);

    // Update PilotProfile model
    const updatedProfile = await PilotProfile.findOneAndUpdate(
      { userId: auth.user.id },
      {
        experience,
        skills,
        specializations,
        equipment,
        availability,
        serviceAreas,
        rate,
        bio: bio || "",
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "Profile updated successfully!",
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Update pilot profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
