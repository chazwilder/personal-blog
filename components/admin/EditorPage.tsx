"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types/blog";
import type { OutputData } from "@editorjs/editorjs";
import ModernBlogEditor from "@/components/admin/ModernBlogEditor";

interface EditorPageProps {
  postId?: string;
}

const EditorPage = ({ postId }: EditorPageProps) => {
  const router = useRouter();
  const isEditMode = Boolean(postId);

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [initialData, setInitialData] = useState<{
    title: string;
    content: OutputData | null;
    category: string;
    tags: string[];
    featuredImage: string;
  } | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
    if (isEditMode && postId) {
      fetchPost();
    }
  }, [isEditMode, postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) throw new Error("Failed to fetch post");

      const { post } = await response.json();
      setInitialData({
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        featuredImage: post.featuredImage || "",
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      router.push("/admin/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSaveOrPublish = async (formData: any) => {
    try {
      const url = isEditMode ? `/api/posts/${postId}` : "/api/posts";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} post`);
      }

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error saving post:", error);
      alert(
        `Failed to ${isEditMode ? "update" : "create"} post. Please try again.`,
      );
    }
  };

  const handleAddCategory = async (categoryName: string) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName.trim() }),
      });

      if (response.ok) {
        await fetchCategories();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add category:", error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-main border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <ModernBlogEditor
      initialData={initialData}
      categories={categories}
      onSave={handleSaveOrPublish}
      onPublish={handleSaveOrPublish}
      onAddCategory={handleAddCategory}
      isEditMode={isEditMode}
    />
  );
};

export default EditorPage;
