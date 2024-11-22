"use client";

import { useEffect, useState } from "react";
import { BlogPost } from "@/types/blog";
import { BlockRenderer } from "@/components/features/blog/blocks/BlockRenderer";
import { PostHeader } from "@/components/features/blog/elements/PostHeader";
import { NotFound } from "@/components/NotFound";
import { RelatedPosts } from "@/components/features/blog/elements/RelatedPosts";
import { SocialShare } from "@/components/features/blog/elements/SocialShare";
import { TableOfContents } from "@/components/features/blog/elements/TableOfContents";
import AuthorSection from "@/components/features/blog/elements/AuthorSection";
import AffiliateItems from "@/components/features/blog/elements/AffiliateItems";

interface BlogContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function ClientBlogPost({
  post,
  relatedPosts,
}: BlogContentProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [tableOfContents, setTableOfContents] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);
  const [shareUrl, setShareUrl] = useState<string>("");

  useEffect(() => {
    setShareUrl(window.location.href);

    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }

    const headers =
      post.content?.blocks
        ?.filter((block) => block.type === "header")
        .map((block) => ({
          id: block.data.text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          text: block.data.text,
          level: block.data.level,
        })) || [];

    setTableOfContents(headers);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" },
    );

    headers.forEach((header) => {
      const element = document.getElementById(header.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [post]);

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-4 relative z-[100] w-full">
      {/* Main Content */}
      <article className="flex-1 w-full lg:max-w-3xl mx-auto">
        <PostHeader
          title={post.title}
          featuredImage={post.featuredImage}
          date={new Date(post.createdAt)}
          readingTime={post.readingTime}
          tags={post.tags}
        />

        {/* Social Share */}
        {shareUrl && <SocialShare url={shareUrl} title={post.title} />}

        {/* Content */}
        <div className="prose prose-invert space-y-2">
          {post.content?.blocks?.map((block, index) => (
            <BlockRenderer key={index} block={block} />
          ))}
        </div>

        {/* Author Section */}
        <AuthorSection />

        {/* Affiliate Section */}
        <AffiliateItems />

        {/* Related Posts */}
        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
      </article>

      {/* Sidebar with TOC */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-6">
          <TableOfContents
            headers={tableOfContents}
            activeSection={activeSection}
          />
        </div>
      </div>
    </div>
  );
}
