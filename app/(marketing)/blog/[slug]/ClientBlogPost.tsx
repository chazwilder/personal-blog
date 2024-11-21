"use client";

import { useEffect, useState } from "react";
import { BlogPost } from "@/types/blog";
import { BlockRenderer } from "@/components/blog/blocks/BlockRenderer";
import { PostHeader } from "@/components/blog/PostHeader";
import { NotFound } from "@/components/NotFound";
import {
  LinkedinIcon,
  TwitterIcon,
  FacebookIcon,
  ExternalLinkIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AUTHOR_INFO } from "@/constants";

interface BlogContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

function SocialShare({ url, title }: { url: string; title: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <span className="text-sm text-white/60">Share:</span>
      <Link
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <LinkedinIcon className="w-4 h-4 text-white/60" />
      </Link>
      <Link
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <TwitterIcon className="w-4 h-4 text-white/60" />
      </Link>
      <Link
        href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <FacebookIcon className="w-4 h-4 text-white/60" />
      </Link>
    </div>
  );
}

function TableOfContents({
  headers,
  activeSection,
}: {
  headers: Array<{ id: string; text: string; level: number }>;
  activeSection: string;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Update URL without triggering a jump
      window.history.pushState({}, "", `#${id}`);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
      <h3 className="text-white/90 font-medium mb-4">Table of Contents</h3>
      <nav className="space-y-2">
        {headers.map((header) => (
          <a
            key={header.id}
            href={`#${header.id}`}
            onClick={(e) => handleClick(e, header.id)}
            className={`block text-sm py-1 transition-colors ${
              activeSection === header.id
                ? "text-main"
                : "text-white/60 hover:text-white"
            }`}
            style={{ paddingLeft: `${(header.level - 1) * 0.75}rem` }}
          >
            {header.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="mt-16">
      <h3 className="text-xl font-bold text-white mb-6">Related Posts</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <article className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/15 transition-colors">
              {post.featuredImage && (
                <div className="aspect-video relative">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.featuredImage.alt || post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white group-hover:text-main transition-colors">
                  {post.title}
                </h4>
                <p className="text-sm text-white/60 mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
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
    // Set share URL once we're on the client
    setShareUrl(window.location.href);

    // Handle initial hash navigation
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

    // Extract headers from content blocks for TOC
    const headers =
      post.content?.blocks
        ?.filter((block) => block.type === "header")
        .map((block) => ({
          id: block.data.text.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          text: block.data.text,
          level: block.data.level,
        })) || [];

    setTableOfContents(headers);

    // Set up intersection observer for active section
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
    <div className="max-w-7xl mx-auto px-4 py-12 mb-16 flex gap-8 relative z-[100]">
      {/* Main Content */}
      <article className="flex-1 max-w-3xl">
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
        <div className="mt-16 border-t border-white/10 pt-8">
          <div className="flex gap-6 items-start">
            <Image
              src={AUTHOR_INFO.image}
              alt={AUTHOR_INFO.name}
              width={100}
              height={100}
              className="rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {AUTHOR_INFO.name}
              </h3>
              <p className="text-white/60 mb-4">{AUTHOR_INFO.bio}</p>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white/80 mb-2">
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {AUTHOR_INFO.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                {AUTHOR_INFO.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    className="text-main hover:underline text-sm flex items-center gap-1"
                  >
                    {link.name}
                    <ExternalLinkIcon className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
      </article>

      {/* Sidebar with TOC */}
      <div className="hidden lg:block w-64">
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
