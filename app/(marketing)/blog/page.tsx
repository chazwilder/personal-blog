"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch posts
  useEffect(() => {
    fetchPosts().then();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data.posts.filter((post) => post.status === "published"));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique tags from all posts
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)));

  // Filter posts by selected tag
  const filteredPosts =
    selectedTag === "all"
      ? posts
      : posts.filter((post) => post.tags.includes(selectedTag));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-main border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col w-full h-full">
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
          all
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
                      {/* Add a description field to your posts or extract from content */}
                      {post.content.blocks?.[0]?.data?.text || ""}
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
                        {/* Add a readTime field to your posts or calculate based on content */}
                        {Math.ceil(post.content.blocks?.length / 4)} minute read
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-neutral-800 text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {post.featuredImage && (
                    <div className="hidden md:block w-48 h-32 rounded-lg overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
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
};

export default BlogPage;
