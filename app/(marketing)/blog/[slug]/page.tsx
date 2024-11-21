import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/actions/posts.actions";
import ClientBlogPost from "./ClientBlogPost";
import { BlogPost } from "@/types/blog";

async function getPost(slug: string): Promise<{
  post: BlogPost | null;
  relatedPosts: BlogPost[];
}> {
  try {
    const result = await getPostBySlug(slug);

    if (!result.success || !result.post) {
      return { post: null, relatedPosts: [] };
    }

    // Fetch related posts based on tags
    const { posts = [] } = await getPosts();
    const relatedPosts = posts
      .filter(
        (p) =>
          p.id !== result.post.id && // Exclude current post
          p.tags?.some((tag) =>
            result.post.tags.some((postTag) => postTag.id === tag.id),
          ),
      )
      .slice(0, 3); // Limit to 3 related posts

    return {
      post: result.post,
      relatedPosts,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { post: null, relatedPosts: [] };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const { post, relatedPosts } = await getPost(slug);

  if (!post) {
    notFound();
  }

  return <ClientBlogPost post={post} relatedPosts={relatedPosts} />;
}
