"use server";

import { db } from "@/lib/mongodb";
import { revalidatePath } from "next/cache";
import { PostStatus, PostVisibility, Prisma } from "@prisma/client";
import { z } from "zod";

const PostCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.any(),
  excerpt: z.string().optional(),
  categoryId: z.string(),
  tagIds: z.array(z.string()),
  featuredImage: z
    .object({
      url: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })
    .optional(),
  status: z.nativeEnum(PostStatus).default("DRAFT"),
  visibility: z.nativeEnum(PostVisibility).default("PUBLIC"),
  password: z.string().optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      canonicalUrl: z.string().url().optional(),
      focusKeywords: z.array(z.string()).optional(),
      ogImage: z.string().url().optional(),
    })
    .optional(),
});

type PostCreateInput = z.infer<typeof PostCreateSchema>;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createPost(
  data: PostCreateInput,
  authorId: string,
): Promise<{ success: boolean; post?: any; error?: any }> {
  try {
    const validated = PostCreateSchema.parse(data);

    const prismaData: Prisma.PostCreateInput = {
      title: validated.title,
      slug: generateSlug(validated.title),
      content: validated.content,
      excerpt: validated.excerpt,
      status: validated.status,
      visibility: validated.visibility,
      password: validated.password,
      featuredImage: validated.featuredImage,
      seo: validated.seo,
      author: {
        connect: { id: authorId },
      },
      category: {
        connect: { id: validated.categoryId },
      },
      tags: {
        connect: validated.tagIds.map((id) => ({ id })),
      },
    };

    const post = await db.post.create({
      data: prismaData,
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    revalidatePath("/blog");
    return { success: true, post };
  } catch (error) {
    console.error("Failed to create post:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: "Failed to create post" };
  }
}

export async function getPosts({
  status,
  visibility,
  page = 1,
  limit = 10,
  categorySlug,
  tagSlug,
}: {
  status?: PostStatus;
  visibility?: PostVisibility;
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
} = {}) {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {
      ...(status && { status }),
      ...(visibility && { visibility }),
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(tagSlug && { tags: { some: { slug: tagSlug } } }),
    };

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        include: {
          author: {
            select: {
              name: true,
              avatar: true,
            },
          },
          category: true,
          tags: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.post.count({ where }),
    ]);

    return {
      posts,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw new Error("Failed to fetch posts");
  }
}
