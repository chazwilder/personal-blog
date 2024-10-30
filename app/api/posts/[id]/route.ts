import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(req: Request, { params }: RouteParams) {
  if (!params?.id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

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

export async function PUT(req: Request, { params }: RouteParams) {
  if (!params?.id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("blog");

    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...body,
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

export async function DELETE(req: Request, { params }: RouteParams) {
  if (!params?.id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

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
