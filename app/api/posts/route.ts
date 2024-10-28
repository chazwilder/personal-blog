import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { BlogPostCreate } from "@/types/blog";

function getSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("blog");

    const post: BlogPostCreate = {
      title: body.title,
      content: body.content,
      featuredImage: body.featuredImage,
      category: body.category,
      tags: body.tags,
      status: body.status,
      slug: getSlug(body.title),
    };

    const result = await db.collection("posts").insertOne({
      ...post,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      postId: result.insertedId,
    });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 },
    );
  }
}
