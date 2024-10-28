import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";

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

    // Generate unique filename
    const uniqueFilename = `${crypto.randomBytes(16).toString("hex")}${path.extname(file.name)}`;

    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await writeFile(path.join(uploadDir, uniqueFilename), buffer);

    // Return the public URL
    const imageUrl = `/uploads/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
