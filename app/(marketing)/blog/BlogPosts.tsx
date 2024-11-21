"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { IBlogPost } from "@/database/post.model";

interface BlogPostsProps {
  initialPosts: IBlogPost[];
}

export default function BlogPosts({ initialPosts }: BlogPostsProps) {
  const [posts] = useState(
    initialPosts.filter((post) => post.status === "published"),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  // Get all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags?.map((tag) => tag.name) || [])),
  );

  // Filter posts based on tag and search query
  const filteredPosts = posts.filter((post) => {
    const matchesTag =
      selectedTag === "all" ||
      post.tags?.some((tag) => tag.name === selectedTag);
    const matchesSearch = searchQuery
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesTag && matchesSearch;
  });

  // Get top picks (most recent posts for now - you can modify this logic)
  const topPicks = posts.slice(0, 3);

  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex gap-8">
      {/* Main Content */}
      <div className="flex-1">
        {/* Static Search Bar */}
        <div className="relative w-full mb-8">
          <div className="flex items-center gap-2 w-full px-4 py-2 bg-white/10 hover:bg-white/15 focus-within:bg-white/15 backdrop-blur-sm rounded-lg border border-white/20 transition-colors">
            <Search className="w-4 h-4 text-white/70" />
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles... (⌘ K)"
              className="w-full bg-transparent text-white border-none outline-none placeholder-white/50 text-sm"
            />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-8">
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
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {post.readingTime} minute read
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
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

      {/* Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        {/* Top Picks Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 mb-6">
          <h3 className="text-white/90 font-medium mb-4">Top Picks</h3>
          <div className="space-y-3">
            {topPicks.map((post) => (
              <div key={post._id}>
                <Link href={`/blog/${post.slug}`} className="block group">
                  <h4 className="text-white/70 text-sm group-hover:text-main transition-colors">
                    {post.title}
                  </h4>
                  <span className="text-white/40 text-xs">
                    {post.tags?.[0]?.name || "Uncategorized"}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
          <h3 className="text-white/90 font-medium mb-4">Categories</h3>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedTag("all")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/10 text-sm transition-colors ${
                selectedTag === "all"
                  ? "text-main bg-white/10"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span>All Posts</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {posts.length}
              </span>
            </button>
            {allTags.map((tag) => {
              const tagCount = posts.filter((post) =>
                post.tags?.some((t) => t.name === tag),
              ).length;

              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/10 text-sm transition-colors ${
                    selectedTag === tag
                      ? "text-main bg-white/10"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <span>{tag}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {tagCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
