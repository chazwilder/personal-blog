"use client";

import React, { useOptimistic, useState, useTransition } from "react";
import { getPosts, deletePost } from "@/lib/actions/posts.actions";
import { useRouter } from "next/navigation";
import { PostHeader } from "./components/PostHeader";
import { PostFilters } from "./components/PostFilters";
import { PostCard } from "./components/PostCard";
import { LoadingState } from "./components/LoadingState";
import { EmptyState } from "./components/EmptyState";
import { toast } from "@/components/ui/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  status: "draft" | "published";
  category: Category;
  tags: Tag[];
  featuredImage?: {
    url: string;
    alt: string;
  };
  createdAt: string;
  updatedAt: string;
}

type PostStatus = "all" | "published" | "draft";

interface PostListProps {
  initialPosts: {
    success: boolean;
    posts?: Post[];
    error?: string;
  };
}

export default function PostList({ initialPosts }: PostListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [posts, setPosts] = useState<Post[]>(initialPosts.posts || []);
  const [optimisticPosts, addOptimisticPost] = useOptimistic<Post[], string>(
    posts,
    (state, postIdToRemove) =>
      state.filter((post) => post.id !== postIdToRemove),
  );

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus>("all");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleFilterChange = () => {
    startTransition(async () => {
      const result = await getPosts();
      if (result.success && result.posts) {
        setPosts(result.posts);
      }
    });
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    addOptimisticPost(postId);

    try {
      const result = await deletePost(postId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete post",
          variant: "destructive",
        });
        handleFilterChange();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
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
              <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
