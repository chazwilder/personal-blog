import { notFound } from "next/navigation";
import { BlogPost } from "@/types/blog";
import Script from "next/script";
import { generateBlogJsonLd, generateBlogMetadata } from "@/lib/seo-config";
import ClientBlogPost from "./ClientBlogPost";
import { headers } from "next/headers";

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/posts/slug/${params.slug}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { post } = await response.json();
    return generateBlogMetadata(post);
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {};
  }
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const baseUrl = await getBaseUrl();
    const url = new URL(`/api/posts/slug/${slug}`, baseUrl);

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.post;
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
  try {
    const post = await getPost(params.slug);

    if (!post) {
      notFound();
    }

    return (
      <>
        <Script
          id="blog-post-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBlogJsonLd(post)),
          }}
        />
        <ClientBlogPost post={post} />
      </>
    );
  } catch (error) {
    console.error("Error in BlogPostPage:", error);
    notFound();
  }
}
