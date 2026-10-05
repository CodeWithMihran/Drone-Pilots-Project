import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/permissions";
import { uploadDocument } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthUser();
    if (auth.errorResponse) return auth.errorResponse;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "drone_documents";

    if (!file) {
      return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds maximum allowed limit (10MB)." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to data URI or upload to Cloudinary
    const mimeType = file.type || "application/octet-stream";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const uploadResult = await uploadDocument(dataUri, folder);

    return NextResponse.json({
      message: "File uploaded successfully",
      url: uploadResult.url,
      publicId: uploadResult.publicId,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
