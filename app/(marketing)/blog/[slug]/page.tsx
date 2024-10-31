// app/(marketing)/blog/[slug]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/types/blog";
import Script from "next/script";
import ClientBlogPost from "./ClientBlogPost";

const defaultMetadata: Metadata = {
  title: "The Curious Coder",
  description: "Full Stack Problem Solver",
  openGraph: {
    title: "The Curious Coder",
    description: "Full Stack Problem Solver",
    url: "https://chazwilder.io",
    siteName: "The Curious Coder",
    images: [
      {
        url: "https://chazwilder.io/logo.png",
        width: 1200,
        height: 630,
        alt: "The Curious Coder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Curious Coder",
    description: "Full Stack Problem Solver",
    images: ["https://chazwilder.io/logo.png"],
  },
};

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const hostname = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = new URL(`/api/posts/slug/${slug}`, hostname);

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    const { post } = await response.json();
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    // Ensure params.slug is awaited if necessary
    const slug = await Promise.resolve(params.slug);
    const post = await getPost(slug);

    if (!post) return defaultMetadata;

    const description =
      post.content.blocks?.[0]?.data?.text?.slice(0, 155) + "..." ||
      "Blog post on The Curious Coder";

    return {
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
        url: `https://chazwilder.io/blog/${post.slug}`,
        siteName: "The Curious Coder",
        images: [
          {
            url: post.featuredImage || "https://chazwilder.io/logo.png",
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        locale: "en_US",
        type: "article",
        authors: ["Chaz Wilder"],
        publishedTime: post.createdAt.toString(),
        modifiedTime: post.updatedAt.toString(),
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [post.featuredImage || "https://chazwilder.io/logo.png"],
        creator: "@chazwilder",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return defaultMetadata;
  }
}

function generateJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.content.blocks?.[0]?.data?.text?.slice(0, 155) + "...",
    image: post.featuredImage || "https://chazwilder.io/logo.png",
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://chazwilder.io/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    // Ensure params.slug is awaited if necessary
    const slug = await Promise.resolve(params.slug);
    const post = await getPost(slug);

    if (!post) {
      notFound();
    }

    return (
      <>
        <Script
          id="blog-post-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateJsonLd(post)),
          }}
        />
        <ClientBlogPost initialPost={post} />
      </>
    );
  } catch (error) {
    console.error("Error in BlogPostPage:", error);
    notFound();
  }
}
