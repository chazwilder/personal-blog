import { connectToDatabase } from "@/lib/mongoose";
import { Image } from "@/database/image.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    await connectToDatabase();

    const image = new Image({
      filename: file.name,
      contentType: file.type,
      data: buffer,
    });

    await image.save();

    const imageUrl = `/api/images/${image._id}`;

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
