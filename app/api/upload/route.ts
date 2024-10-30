import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
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

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");

    try {
      // Create directory if it doesn't exist
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
        console.log("Created uploads directory:", uploadDir);
      }

      // Log directory status
      console.log("Upload directory status:", {
        path: uploadDir,
        exists: existsSync(uploadDir),
        isAbsolute: path.isAbsolute(uploadDir),
      });
    } catch (dirError) {
      console.error("Error creating/checking uploads directory:", dirError);
      throw dirError;
    }

    // Generate file path and attempt to save
    const filePath = path.join(uploadDir, uniqueFilename);
    console.log("Attempting to write file to:", filePath);

    try {
      await writeFile(filePath, buffer);
      console.log("Successfully wrote file:", filePath);
    } catch (writeError) {
      console.error("Error writing file:", writeError);
      throw writeError;
    }

    // Get host info for debugging
    const host = request.headers.get("host") || "localhost:8000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    // Return both relative and full URLs for debugging
    const imageUrl = `/uploads/${uniqueFilename}`;
    const fullUrl = `${protocol}://${host}${imageUrl}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      debug: {
        fullUrl,
        uploadDirectory: uploadDir,
        fileName: uniqueFilename,
        fileSize: buffer.length,
        host,
        protocol,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
        path: process.cwd(),
        env: process.env.NODE_ENV,
      },
      { status: 500 },
    );
  }
}

// Set correct response size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
