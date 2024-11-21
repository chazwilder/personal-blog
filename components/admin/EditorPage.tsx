"use client";
import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ICategory } from "@/database/category.model";
import type { OutputData } from "@editorjs/editorjs";
import ModernBlogEditor from "@/components/admin/ModernBlogEditor";
import {
  getPost,
  getCategories,
  createPost,
  updatePost,
  createCategory,
} from "@/lib/actions/posts.actions";
import { toast } from "@/components/ui/use-toast";

interface EditorPageProps {
  postId?: string;
}

interface SerializedCategory {
  _id: string;
  name: string;
  postCount: number;
  createdAt?: string;
  updatedAt?: string;
}

const EditorPage = ({ postId }: EditorPageProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditMode = Boolean(postId);

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [initialData, setInitialData] = useState<{
    title: string;
    content: OutputData | null;
    category: string;
    tags: string[];
    featuredImage: string;
  } | null>(null);
  const [categories, setCategories] = useState<SerializedCategory[]>([]);

  useEffect(() => {
    const initialize = async () => {
      const categoriesResult = await getCategories();
      if (categoriesResult.success) {
        setCategories(categoriesResult.categories);
      }

      if (isEditMode && postId) {
        const postResult = await getPost(postId);
        if (postResult.success) {
          setInitialData(postResult.post);
        } else {
          router.push("/admin/dashboard");
        }
      }
      setIsLoading(false);
    };

    initialize();
  }, [isEditMode, postId, router]);

  const handleSaveOrPublish = async (formData: any) => {
    try {
      startTransition(async () => {
        const result = isEditMode
          ? await updatePost(postId!, formData)
          : await createPost(formData);

        if (result.success) {
          toast({
            title: "Success",
            description: `Post ${isEditMode ? "updated" : "created"} successfully!`,
          });
          router.push("/admin/dashboard");
        } else {
          throw new Error(result.error);
        }
      });
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? "update" : "create"} post. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = async (categoryName: string) => {
    try {
      const result = await createCategory(categoryName.trim());
      if (result.success) {
        const categoriesResult = await getCategories();
        if (categoriesResult.success) {
          setCategories(categoriesResult.categories);
        }
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
