import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireRole } from "@/lib/permissions";
import { User } from "@/models/User";
import { CompanyProfile } from "@/models/CompanyProfile";
import { CompanyProfileSchema } from "@/lib/validations";

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireRole(["COMPANY"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await req.json();
    const validation = CompanyProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      name,
      companyName,
      contactPerson,
      phone,
      industry,
      website,
      description,
      city,
      state,
      country,
      logo,
    } = validation.data;

    await connectToDatabase();

    const userUpdate: any = {
      name,
      phone: phone || "",
      location: {
        city,
        state,
        country: country || "United States",
      },
    };
    if (logo) {
      userUpdate.profileImage = logo;
    }

    await User.findByIdAndUpdate(auth.user.id, userUpdate);

    const updatedProfile = await CompanyProfile.findOneAndUpdate(
      { userId: auth.user.id },
      {
        companyName,
        contactPerson: contactPerson || name,
        logo: logo || "",
        industry,
        website: website || "",
        description: description || "",
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      message: "Company profile updated successfully!",
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error("Update company profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
