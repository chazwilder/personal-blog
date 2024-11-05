"use client";

import React, { useOptimistic, useState, useTransition } from "react";
import { BlogPost } from "@/types/blog";
import { deletePost, getPosts } from "@/lib/actions/posts";
import { useRouter } from "next/navigation";
import { PostHeader } from "./components/PostHeader";
import { PostFilters } from "./components/PostFilters";
import { PostCard } from "./components/PostCard";
import { LoadingState } from "./components/LoadingState";
import { EmptyState } from "./components/EmptyState";

type PostStatus = "all" | "published" | "draft";

interface PostListProps {
  initialPosts: {
    success: boolean;
    data?: BlogPost[];
    error?: string;
  };
}

export default function PostList({ initialPosts }: PostListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts.data || []);
  const [optimisticPosts, addOptimisticPost] = useOptimistic<
    BlogPost[],
    string
  >(posts, (state, postIdToRemove) =>
    state.filter((post) => post._id !== postIdToRemove),
  );

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus>("all");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleFilterChange = () => {
    startTransition(async () => {
      const result = await getPosts({
        searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder,
      });
      if (result.success && result.data) {
        setPosts(result.data);
      }
    });
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    addOptimisticPost(postId);

    try {
      const result = await deletePost(postId);
      if (result.success) {
        router.refresh();
      } else {
        handleFilterChange();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      handleFilterChange();
    }
  };

  const filteredPosts = [...optimisticPosts]
    .filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc"
          ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          : new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortOrder === "desc"
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
    });

  return (
    <div className="max-w-7xl mx-auto">
      <PostHeader />

      <PostFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={(value) => {
          setSearchTerm(value);
          handleFilterChange();
        }}
        onStatusChange={(value) => {
          setStatusFilter(value);
          handleFilterChange();
        }}
        onSortChange={(newSortBy, newSortOrder) => {
          setSortBy(newSortBy);
          setSortOrder(newSortOrder);
          handleFilterChange();
        }}
      />

      {isPending ? (
        <LoadingState />
      ) : filteredPosts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            {filteredPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
