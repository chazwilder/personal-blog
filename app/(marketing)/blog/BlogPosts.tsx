"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: {
    blocks: any[];
  };
  featuredImage?: {
    url: string;
    alt: string;
  };
  tags: {
    _id: string;
    name: string;
    slug: string;
  }[];
  createdAt: string;
}

interface BlogPostsProps {
  initialPosts: BlogPost[];
}

export default function BlogPosts({ initialPosts }: BlogPostsProps) {
  const [posts] = useState(initialPosts);
  const [selectedTag, setSelectedTag] = useState("all");

  // Get unique tags from all posts
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags?.map((tag) => tag.name) || [])),
  );

  // Filter posts by selected tag
  const filteredPosts =
    selectedTag === "all"
      ? posts
      : posts.filter((post) =>
          post.tags?.some((tag) => tag.name === selectedTag),
        );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col w-full h-full z-[999]">
      {/* Tags Filter */}
      <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4">
        <button
          onClick={() => setSelectedTag("all")}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            selectedTag === "all"
              ? "bg-main text-black"
              : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedTag === tag
                ? "bg-main text-black"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="space-y-8 w-full">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <article className="group relative bg-neutral-700 rounded-lg p-6 hover:bg-neutral-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-white group-hover:text-main transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-neutral-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-neutral-500">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {Math.ceil((post.content?.blocks?.length || 0) / 4)}{" "}
                        minute read
                      </span>
                    </div>
                    <div key={post._id} className="flex flex-wrap gap-2">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag._id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-neutral-800 text-neutral-400"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {post.featuredImage && (
                    <div className="hidden md:block w-48 h-32 rounded-lg overflow-hidden">
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.alt || post.title}
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
