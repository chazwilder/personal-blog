import { Metadata } from "next/types";

interface SeoConfig {
  title: string;
  description: string;
  url: string;
  siteName: string;
  locale: string;
  type: string;
  images: {
    url: string;
    width: number;
    height: number;
    alt: string;
  }[];
}

const defaultSeoConfig: SeoConfig = {
  title: "The Curious Coder | Full Stack Problem Solver",
  description:
    "A blog about software development, automation, and solving real-world problems through code. Written by Chaz Wilder, a full stack developer specializing in React, Next.js, and Rust.",
  url: "https://chazwilder.io",
  siteName: "The Curious Coder",
  locale: "en_US",
  type: "website",
  images: [
    {
      url: "/logo.png",
      width: 1200,
      height: 630,
      alt: "The Curious Coder Blog",
    },
  ],
};

export function generateMetadata(params: Partial<SeoConfig> = {}): Metadata {
  const seo = { ...defaultSeoConfig, ...params };

  return {
    title: {
      default: seo.title,
      template: `%s | ${seo.siteName}`,
    },
    description: seo.description,
    metadataBase: new URL(seo.url),
    alternates: {
      canonical: seo.url,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url,
      siteName: seo.siteName,
      locale: seo.locale,
      type: seo.type,
      images: seo.images,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.images,
      creator: "@chazwilder", // Replace with your Twitter handle
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-site-verification", // Add your Google verification code
      yandex: "your-yandex-verification", // Add if you need Yandex verification
    },
  };
}

export function generateBlogMetadata(post: {
  title: string;
  content: any;
  featuredImage?: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}): Metadata {
  const description =
    post.content.blocks?.[0]?.data?.text?.slice(0, 155) + "..." || "";

  return generateMetadata({
    title: post.title,
    description,
    url: `/blog/${post.slug}`,
    type: "article",
    images: post.featuredImage
      ? [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ]
      : defaultSeoConfig.images,
  });
}

export function generateBlogJsonLd(post: {
  title: string;
  content: any;
  featuredImage?: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.content.blocks?.[0]?.data?.text?.slice(0, 155) + "...",
    image: post.featuredImage || defaultSeoConfig.images[0].url,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: "Chaz Wilder",
      url: defaultSeoConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: defaultSeoConfig.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${defaultSeoConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${defaultSeoConfig.url}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };
}
