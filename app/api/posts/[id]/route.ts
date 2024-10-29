import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { BlogPostCreate } from "@/types/blog";
import { ObjectId } from "mongodb";

function getSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const client = await clientPromise;
    const db = client.db("blog");

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(params.id),
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}

// PUT /api/posts/[id] - Update post
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("blog");

    const updateData: Partial<BlogPostCreate> = {
      title: body.title,
      content: body.content,
      featuredImage: body.featuredImage,
      category: body.category,
      tags: body.tags,
      status: body.status,
    };

    // Only update slug if title is being updated
    if (body.title) {
      updateData.slug = getSlug(body.title);
    }

    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 },
    );
  }
}

// DELETE /api/posts/[id] - Delete post
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const client = await clientPromise;
    const db = client.db("blog");

    const result = await db.collection("posts").deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
