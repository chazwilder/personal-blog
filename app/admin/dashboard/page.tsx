"use client";
import React, { useEffect, useState } from "react";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

type PostStatus = "all" | "published" | "draft";

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus>("all");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch posts
  useEffect(() => {
    fetchPosts().then();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      console.log("Published Posts: ", data);
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      // Remove post from state
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Filter and sort posts
  const filteredPosts = posts
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
      } else {
        return sortOrder === "desc"
          ? b.title.localeCompare(a.title)
          : a.title.localeCompare(b.title);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Posts
          </h1>
          <Link
            href="/admin/editor"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-main text-black rounded-md hover:bg-main/80 transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              />
            </div>

            <div className="flex flex-row gap-4">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PostStatus)}
                className="flex-1 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split("-");
                  setSortBy(newSortBy as "date" | "title");
                  setSortOrder(newSortOrder as "asc" | "desc");
                }}
                className="flex-1 text-white px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-main border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">No posts found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="min-w-full divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className="flex flex-col sm:flex-row sm:items-center p-4 hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                    <div className="flex items-center">
                      {post.featuredImage && (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {post.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 sm:hidden">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              post.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {post.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(post.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-8">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.status}
                    </span>
                    <span className="text-sm text-gray-500 w-24">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500 w-32">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-3 mt-2 sm:mt-0 sm:ml-4">
                    <Link
                      href={`/admin/editor/${post._id}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post._id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
