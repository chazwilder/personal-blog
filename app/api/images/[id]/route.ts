import { connectToDatabase } from "@/lib/mongoose";
import { Image } from "@/database/image.model";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDatabase();

    const image = await Image.findById(params.id);

    if (!image) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const response = new NextResponse(image.data);

    response.headers.set("Content-Type", image.contentType);
    response.headers.set("Cache-Control", "public, max-age=31536000");

    return response;
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Error serving image", { status: 500 });
  }
}
