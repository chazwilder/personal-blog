import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/actions/posts.actions";
import ClientBlogPost from "../../../../components/features/blog/ClientBlogPost";
import { BlogPost } from "@/types/blog";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getPostBySlug(params.slug);

  if (!result.success || !result.post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const post = result.post;

  return {
    title: `Chaz Wilder | ${post.seo?.metaTitle || post.title}`,
    description:
      post.seo?.metaDescription ||
      post.excerpt ||
      `Read ${post.title} on our blog`,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      type: "article",
      url: post.seo?.canonicalUrl || `/blog/${post.slug}`,
      images: [
        {
          url:
            post.seo?.ogImage || post.featuredImage?.url || "/default-og.jpg",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: [
        post.seo?.ogImage || post.featuredImage?.url || "/default-og.jpg",
      ],
    },
    keywords: post.seo?.focusKeywords || post.tags.map((tag) => tag.name),
    alternates: {
      canonical: post.seo?.canonicalUrl || `/blog/${post.slug}`,
    },
  };
}

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

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            image: post.seo?.ogImage || post.featuredImage?.url,
            url: post.seo?.canonicalUrl || `/blog/${post.slug}`,
            datePublished: post.createdAt,
            dateModified: post.updatedAt,
            author: {
              "@type": "Person",
              name: "Chaz Wilder",
              url: "https://chazwilder.io",
            },
            publisher: {
              "@type": "Organization",
              name: "The Curious Coder",
              logo: {
                "@type": "ImageObject",
                url: "https://chazwilder.io/logo.png",
              },
            },
            keywords:
              post.seo?.focusKeywords?.join(", ") ||
              post.tags.map((tag) => tag.name).join(", "),
          }),
        }}
      />
      <ClientBlogPost post={post} relatedPosts={relatedPosts} />
    </>
  );
}
