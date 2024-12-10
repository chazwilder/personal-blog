"use server";

import { connectToDatabase } from "@/lib/mongoose";
import { Post } from "@/database/post.model";
import { Category } from "@/database/category.model";
import { Tag } from "@/database/tag.model";
import { User } from "@/database/user.model";
import { Image } from "@/database/image.model";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { calculateReadingTime } from "@/lib/utils";

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  focusKeywords?: string[];
  ogImage?: string;
}

export interface PostFormData {
  title: string;
  content: any;
  category: string;
  tags: string[];
  featuredImage?: string;
  featuredImageId?: string;
  status: "draft" | "published";
  seo?: SEOData;
}

export async function getPost(postId: string) {
  try {
    await connectToDatabase();
    const post = await Post.findById(postId).lean().exec();

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    // Convert MongoDB specific types to plain JavaScript types
    const sanitizedPost = {
      title: post.title,
      content: post.content,
      category:
        typeof post.category === "object"
          ? post.category.toString()
          : post.category,
      tags: Array.isArray(post.tags)
        ? post.tags.map((tag) =>
            typeof tag === "object" ? tag.toString() : tag,
          )
        : [],
      featuredImage: post.featuredImage?.url || "",
      featuredImageId: post.featuredImage?.imageId
        ? post.featuredImage.imageId.toString()
        : "",
      seo: {
        metaTitle: post.seo?.metaTitle || post.title,
        metaDescription: post.seo?.metaDescription || "",
        canonicalUrl: post.seo?.canonicalUrl || null,
        focusKeywords: post.seo?.focusKeywords || [],
        ogImage: post.seo?.ogImage || post.featuredImage?.url || null,
      },
    };

    return {
      success: true,
      post: sanitizedPost,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { success: false, error: "Failed to fetch post" };
  }
}

export async function getPosts() {
  try {
    await connectToDatabase();
    const posts = await Post.find({})
      .populate("category")
      .populate("tags")
      .populate("author")
      .lean();

    const transformedPosts = posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      excerpt: post.excerpt,
      readingTime: calculateReadingTime(post.content.blocks),
      slug: post.slug,
      status: post.status,
      category: post.category
        ? {
            id: post.category._id.toString(),
            name: post.category.name,
            slug: post.category.slug,
          }
        : null,
      tags: (post.tags || []).map((tag) => ({
        id: tag._id.toString(),
        name: tag.name,
        slug: tag.slug,
      })),
      featuredImage: post.featuredImage,
      featuredImageId: post.featuredImage?.imageId
        ? post.featuredImage.imageId.toString()
        : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      seo: post.seo
        ? {
            metaTitle: post.seo.metaTitle,
            metaDescription: post.seo.metaDescription,
            canonicalUrl: post.seo.canonicalUrl,
            focusKeywords: post.seo.focusKeywords,
            ogImage: post.seo.ogImage,
          }
        : null,
    }));

    return {
      success: true,
      posts: transformedPosts,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
}

export async function createPost(formData: PostFormData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectToDatabase();
    const { userId } = await auth();

    console.log(await auth());
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const authorId = await getOrCreateUser(userId);
    const categoryId = await getOrCreateCategory(formData.category);
    const tagIds = await getOrCreateTags(formData.tags);
    const slug = slugify(formData.title, { lower: true, strict: true });

    // Extract meta description from content if not provided
    let metaDescription = formData.seo?.metaDescription || "";
    if (!metaDescription && formData.content?.blocks) {
      const firstParagraph = formData.content.blocks.find(
        (block) => block.type === "paragraph",
      );
      if (firstParagraph?.data?.text) {
        metaDescription = firstParagraph.data.text
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 155);

        if (firstParagraph.data.text.length > 155) {
          metaDescription += "...";
        }
      }
    }

    const newPost = new Post({
      title: formData.title,
      content: formData.content,
      category: categoryId,
      tags: tagIds,
      featuredImage: formData.featuredImage
        ? {
            url: formData.featuredImage,
            alt: formData.title,
            imageId: formData.featuredImageId || null,
          }
        : null,
      slug,
      status: formData.status,
      author: authorId,
      seo: {
        metaTitle: formData.seo?.metaTitle || formData.title,
        metaDescription,
        canonicalUrl: formData.seo?.canonicalUrl || null,
        focusKeywords: formData.seo?.focusKeywords || formData.tags,
        ogImage: formData.seo?.ogImage || formData.featuredImage || null,
      },
    });

    await newPost.save({ session });
    await session.commitTransaction();

    revalidatePath("/admin/dashboard");
    revalidatePath("/blog");

    return { success: true, postId: newPost._id.toString() };
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  } finally {
    session.endSession();
  }
}

export async function updatePost(postId: string, formData: PostFormData) {
  try {
    await connectToDatabase();
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Extract meta description from content if not provided
    let metaDescription = formData.seo?.metaDescription || "";
    if (!metaDescription && formData.content?.blocks) {
      const firstParagraph = formData.content.blocks.find(
        (block) => block.type === "paragraph",
      );
      if (firstParagraph?.data?.text) {
        metaDescription = firstParagraph.data.text.slice(0, 155);
      }
    }

    // Prepare the update data
    const updateData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
      status: formData.status,
      seo: {
        metaTitle: formData.seo?.metaTitle || formData.title,
        metaDescription,
        canonicalUrl: formData.seo?.canonicalUrl || null,
        focusKeywords: formData.seo?.focusKeywords || formData.tags,
        ogImage: formData.seo?.ogImage || formData.featuredImage || null,
      },
    };

    // Only add featuredImage if it exists
    if (formData.featuredImage) {
      updateData.featuredImage = {
        url: formData.featuredImage,
        alt: formData.title,
        imageId: formData.featuredImageId || null,
      };
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
    }).lean();

    if (!updatedPost) {
      return { success: false, error: "Post not found" };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath(`/blog/${updatedPost.slug}`);

    return { success: true, postId: updatedPost._id.toString() };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error: "Failed to update post" };
  }
}

export async function createCategory(name: string) {
  try {
    await connectToDatabase();
    const newCategory = new Category({
      name,
      slug: slugify(name, { lower: true, strict: true }),
    });
    await newCategory.save();
    revalidatePath("/admin/dashboard");
    return { success: true, category: newCategory };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function getOrCreateTags(tagNames: string[]) {
  const tags = await Promise.all(
    tagNames.map(async (name) => {
      const normalized = name.trim().toLowerCase();
      const existingTag = await Tag.findOne({ name: normalized });
      if (existingTag) return existingTag._id;

      const newTag = await Tag.create({
        name: normalized,
        slug: slugify(normalized, { lower: true, strict: true }),
      });
      return newTag._id;
    }),
  );
  return tags;
}

export async function getOrCreateCategory(categoryName: string) {
  const normalized = categoryName.trim();
  const existingCategory = await Category.findOne({ name: normalized });
  if (existingCategory) return existingCategory._id;

  const newCategory = await Category.create({
    name: normalized,
    slug: slugify(normalized, { lower: true, strict: true }),
  });
  return newCategory._id;
}

export async function getOrCreateUser(clerkId: string) {
  const existingUser = await User.findOne({ clerkId });
  if (existingUser) return existingUser._id;

  // Generate a shorter, unique username
  const baseUsername = "user";
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const username = `${baseUsername}_${randomSuffix}`;

  // Fetch user data from Clerk
  try {
    const user = await clerkClient.users.getUser(clerkId);

    const newUser = await User.create({
      clerkId,
      username, // Using the generated shorter username
      email: user.emailAddresses[0]?.emailAddress || `${username}@example.com`,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || username,
      role: "author",
    });

    return newUser._id;
  } catch (error) {
    // Fallback if Clerk API call fails
    const newUser = await User.create({
      clerkId,
      username,
      email: `${username}@example.com`,
      name: username,
      role: "author",
    });

    return newUser._id;
  }
}

export async function deletePost(postId: string) {
  try {
    await connectToDatabase();
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const post = await Post.findById(postId);

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    if (post.featuredImage?.imageId) {
      try {
        await Image.findByIdAndDelete(post.featuredImage.imageId);
      } catch (error) {
        console.error("Error deleting associated image:", error);
      }
    }

    await Post.findByIdAndDelete(postId);

    revalidatePath("/admin/dashboard");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    };
  }
}

export async function getPostBySlug(slug: string) {
  try {
    await connectToDatabase();
    const post = await Post.findOne({ slug })
      .populate("category")
      .populate("tags")
      .populate("author")
      .lean()
      .exec();

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    const transformedPost = {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      readingTime: calculateReadingTime(post.content.blocks),
      slug: post.slug,
      status: post.status,
      category: post.category
        ? {
            id: post.category._id.toString(),
            name: post.category.name,
            slug: post.category.slug,
          }
        : null,
      tags: (post.tags || []).map((tag) => ({
        id: tag._id.toString(),
        name: tag.name,
        slug: tag.slug,
      })),
      featuredImage: post.featuredImage?.url || "",
      featuredImageId: post.featuredImage?.imageId
        ? post.featuredImage.imageId.toString()
        : null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      author: post.author
        ? {
            id: post.author._id.toString(),
            name: post.author.name,
            email: post.author.email,
          }
        : null,
      seo: post.seo
        ? {
            metaTitle: post.seo.metaTitle || post.title,
            metaDescription: post.seo.metaDescription || "",
            canonicalUrl: post.seo.canonicalUrl || null,
            focusKeywords: post.seo.focusKeywords || [],
            ogImage: post.seo.ogImage || post.featuredImage?.url || null,
          }
        : null,
    };

    return {
      success: true,
      post: transformedPost,
    };
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return {
      success: false,
      error: "Failed to fetch post",
    };
  }
}

export async function getCategories() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ name: 1 }).lean(); // Add lean() to get plain JavaScript objects

    // Convert MongoDB objects to plain JavaScript objects
    const serializedCategories = categories.map((cat) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug || slugify(cat.name, { lower: true, strict: true }),
      postCount: cat.postCount || 0,
      createdAt: cat.createdAt ? cat.createdAt.toISOString() : null,
      updatedAt: cat.updatedAt ? cat.updatedAt.toISOString() : null,
    }));

    return {
      success: true,
      categories: serializedCategories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "Failed to fetch categories",
    };
  }
}
