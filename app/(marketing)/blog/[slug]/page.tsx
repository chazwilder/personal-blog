import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/actions/posts.actions";
import ClientBlogPost from "./ClientBlogPost";
import { BlogPost } from "@/types/blog";

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const result = await getPostBySlug(slug);

    if (!result.success || !result.post) {
      return null;
    }

    return result.post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return <ClientBlogPost post={post} />;
}
