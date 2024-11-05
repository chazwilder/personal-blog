"use server";

import { Post } from "@/models";
import dbConnect from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { withErrorHandling } from "@/lib/utils/mongoose";
import type { PostFilter, BlogPost } from "@/types/blog";

function serializePost(post: any): BlogPost {
  return {
    _id: post._id.toString(),
    title: post.title,
    content: post.content,
    featuredImage: post.featuredImage,
    category: post.category,
    tags: post.tags,
    status: post.status,
    slug: post.slug,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: post.author
      ? {
          _id: post.author._id?.toString(),
          name: post.author.name,
          avatar: post.author.avatar,
        }
      : null,
  };
}

export async function getPosts(filter: PostFilter = {}) {
  await dbConnect();

  const result = await withErrorHandling(Post, "fetch-posts", async () => {
    const query: any = {};

    if (filter.status && filter.status !== "all") {
      query.status = filter.status;
    }

    if (filter.searchTerm) {
      query.title = {
        $regex: filter.searchTerm,
        $options: "i",
      };
    }

    const sort: any = {};
    if (filter.sortBy === "title") {
      sort.title = filter.sortOrder === "desc" ? -1 : 1;
    } else {
      sort.updatedAt = filter.sortOrder === "desc" ? -1 : 1;
    }

    const posts = await Post.find(query)
      .sort(sort)
      .populate("author", "name avatar")
      .lean();

    const serializedPosts = posts.map(serializePost);

    return serializedPosts;
  });

  return result;
}

export async function deletePost(postId: string) {
  await dbConnect();

  return await withErrorHandling(Post, "delete", async () => {
    await Post.findByIdAndDelete(postId);
    revalidatePath("/admin/dashboard");
    return true;
  });
}
